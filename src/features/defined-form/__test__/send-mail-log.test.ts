import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn() }));

vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail }) },
}));

const ADDRESS = "someone@example.com";
const BODY = "STUDENT_FREE_TEXT";
const SUBJECT = "FORM_TITLE";

describe("sendSystemMessageMail logging", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("logs neither the address, the subject nor the body", async () => {
    const { sendSystemMessageMail } = await import("../send-mail");

    await sendSystemMessageMail(ADDRESS, BODY, SUBJECT);

    const logged = logSpy.mock.calls.flat().map(value => JSON.stringify(value)).join("\n");
    for (const secret of [ADDRESS, BODY, SUBJECT]) {
      expect(logged).not.toContain(secret);
    }
  });

  it("sends the same mail", async () => {
    vi.stubEnv("EMAIL_FROM", "form@example.com");
    const { sendSystemMessageMail } = await import("../send-mail");

    await sendSystemMessageMail(ADDRESS, BODY, SUBJECT);

    expect(sendMail).toHaveBeenCalledWith({
      to: ADDRESS,
      from: "form@example.com",
      subject: SUBJECT,
      text: BODY,
    });
    vi.unstubAllEnvs();
  });
});
