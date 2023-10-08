const uuid = (() => {
    const HEX_OCTETS = Object.freeze(
        [...Array(0x100)].map((e, i) =>
            i.toString(0x10).padStart(2, "0").toUpperCase()
        ),
    );
    const VERSION = 0x40;
    const VARIANT = 0x80;
    const bytes = new Uint8Array(16);
    const rand = new Uint32Array(bytes.buffer);

    return () => {
        for (let i = 0; i < rand.length; i++) {
            rand[i] = Math.random() * 0x100000000 >>> 0;
        }

        return "" +
            HEX_OCTETS[bytes[0]] +
            HEX_OCTETS[bytes[1]] +
            HEX_OCTETS[bytes[2]] +
            HEX_OCTETS[bytes[3]] + "-" +
            HEX_OCTETS[bytes[4]] +
            HEX_OCTETS[bytes[5]] + "-" +
            HEX_OCTETS[bytes[6] & 0x0f | VERSION] +
            HEX_OCTETS[bytes[7]] + "-" +
            HEX_OCTETS[bytes[8] & 0x3f | VARIANT] +
            HEX_OCTETS[bytes[9]] + "-" +
            HEX_OCTETS[bytes[10]] +
            HEX_OCTETS[bytes[11]] +
            HEX_OCTETS[bytes[12]] +
            HEX_OCTETS[bytes[13]] +
            HEX_OCTETS[bytes[14]] +
            HEX_OCTETS[bytes[15]];
    };
})();

// see https://zenn.dev/kota_yata/articles/89b10ac8c93b92
const url_safe_chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const normal_chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
type ConvertOption = {
    mode: "urlSafe" | "normal";
};
const defaultOption = {
    mode: "urlSafe",
} as const satisfies ConvertOption;

const remap = (
    source: readonly number[],
    { from, to }: { from: number; to: number },
) => {
    // Split each number into three parts:
    //   - l: A left part, which is the right side of the previous number
    //   - m: A middle part, which is the left side of this number
    //   - r: A right part, which is the left side of the next number
    //   - If the number is too large, it will be split into more parts
    const split = (
        n: number,
        i: number,
    ): readonly [
        l: number[],
        m: number[],
        r: number[],
    ] => {
        const shift = from - (to - from * i % to);
        const mask = 2 ** to - 1;
        const l = shift >= 0 ? [n >>> shift] : [];
        const m = shift >= to ? [(n << (to - shift)) & mask] : [];
        if (shift < 0) return [l, m, [(n << -shift) & mask]];
        const r = shift === 0 || shift >= to ? [] : [(n << (to - shift)) & mask];
        return [l, m, r] as const;
    };

    return source.map(split).flatMap(([l, m, r], i, arr) => {
        const last: boolean = i === arr.length - 1;
        const prev = arr[i - 1]?.[2]?.[0] ?? 0;
        l = l.length > 0 ? [l[0] + prev] : [];
        r = last ? r : [];
        return [...l, ...m, ...r];
    });
};

const encode = (src: Uint8Array | string, opt?: ConvertOption) => {
    const { mode } = { ...defaultOption, ...opt };
    const chars = mode === "normal" ? normal_chars : url_safe_chars;

    const bytes = typeof src === "string" ? (new TextEncoder()).encode(src) : src;

    const encoded = remap([...bytes], { from: 8, to: 6 })
        .map((b) => chars[b])
        .join("");

    const tailLen = mode === "normal" ? (4 - encoded.length % 4) % 4 : 0;
    return encoded + "=".repeat(tailLen);
};
const decode = (base64Text: string, opt?: ConvertOption): Uint8Array => {
    const { mode } = { ...defaultOption, ...opt };
    const chars = mode === "normal" ? normal_chars : url_safe_chars;
    const strArray = [...base64Text.replaceAll("=", "")];
    const len = Math.floor(strArray.length * 6 / 8);
    const uint6Array = strArray.map((t) => chars.indexOf(t));
    return new Uint8Array(remap(uint6Array, { from: 6, to: 8 }).slice(0, len));
};

const sliceByLen = <T extends ReadonlyArray<unknown> | string>(
    src: T,
    len: number,
) => {
    const size = Math.ceil(src.length / len);
    return [...Array(size).keys()].map((i) =>
        src.slice(i * len, i * len + len)
    ) as T extends string ? string[] : T[];
};

const toShortUUID = (uuid: string) => {
    const bytes = sliceByLen(uuid.replaceAll("-", ""), 2).map((t) =>
        parseInt(t, 16)
    );
    return encode(new Uint8Array(bytes));
};

const toUUID = (base64ShortId: string) => {
    const uint8Array = [...decode(base64ShortId)];
    const str = uint8Array.map((u) => u.toString(16).padStart(2, "0")).join("");
    return str.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
};

const shortUUID = () => toShortUUID(uuid());

export { uuid, toShortUUID, toUUID, shortUUID };
