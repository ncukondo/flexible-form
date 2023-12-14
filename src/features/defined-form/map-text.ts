type Mapper<T> = (match: string, index: number) => T;
type MapDict<T> = {
  "$default": (text: string, index: number) => T;
} & { [regExpKey: string]: Mapper<T> };

const filterNull = <T>(v: (T | null | undefined)): v is T => v !== null && v !== undefined;
const findMin = <T>(arr: T[], fn: (v: T) => number): T => {
  let min = arr[0];
  let minVal = fn(min);
  arr.forEach(v => {
    const val = fn(v);
    if (val < minVal) {
      min = v;
      minVal = val;
    }
  });
  return min;
}

const mapText = <T>(text: string, mapDict: MapDict<T>): T[] => {
  let absoluteIndex = 0;
  const seekAndMap = (text: string, mapDict: MapDict<T>, prev: T[] = []): T[] => {
    const keys = Object.keys(mapDict).filter(k => k !== "$default");
    const matchResult = keys.map(key => {
      const reg = new RegExp(key, "g");
      const match = reg.exec(text);
      return match ? { match, index: reg.lastIndex, mapper: mapDict[key] } : null;
    }).filter(filterNull);
    if (matchResult.length === 0) {
      return [...prev, mapDict["$default"](text, absoluteIndex)];
    }
    const { match, index, mapper } = findMin(matchResult, v => v.index);
    const prevText = text.slice(0, index - match[0].length);  // text before match
    const nextText = text.slice(index);
    const mapped = mapper(match[0], absoluteIndex + index - match[0].length);
    const nextPrev = prevText.length > 0
      ? [...prev, mapDict["$default"](prevText, absoluteIndex), mapped]
      : [...prev, mapped];
    absoluteIndex += index;
    return nextText.length > 0 ? seekAndMap(nextText, mapDict, nextPrev) : nextPrev;
  }
  return seekAndMap(text, mapDict);
}

export { mapText, type Mapper, type MapDict }
