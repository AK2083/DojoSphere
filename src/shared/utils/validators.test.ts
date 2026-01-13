import { describe, it, expect } from "vitest";

import { required, emailValidator, passwordValidator } from "./validators";

describe("required validator", () => {
  it("returns error if value is empty string", () => {
    expect(required("")).toBe("Pflichtfeld");
  });

  it("returns error if value is undefined-like", () => {
    // @ts-expect-error – absichtlich falscher Typ
    expect(required(undefined)).toBe("Pflichtfeld");
  });

  it("returns null if value is non-empty", () => {
    expect(required("test")).toBeNull();
  });
});

describe("emailValidator", () => {
  it("returns error if email is empty", () => {
    expect(emailValidator("")).toBe("E-Mail ist erforderlich");
  });

  it("returns error if email is invalid", () => {
    expect(emailValidator("invalid-email")).toBe("Ungültige E-Mail");
    expect(emailValidator("test@")).toBe("Ungültige E-Mail");
    expect(emailValidator("test@test")).toBe("Ungültige E-Mail");
  });

  it("returns null if email is valid", () => {
    expect(emailValidator("test@test.de")).toBeNull();
    expect(emailValidator("user.name+tag@example.com")).toBeNull();
  });
});

describe("passwordValidator", () => {
  it("returns error if password is empty", () => {
    expect(passwordValidator("")).toBe("Passwort erfüllt nicht alle Regeln");
  });

  it("returns error if one rule fails", () => {
    expect(passwordValidator("Abcdefg1")).toBe("Passwort erfüllt nicht alle Regeln");
  });

  it("returns null if all rules are fulfilled", () => {
    expect(passwordValidator("Abcdef1!")).toBeNull();
  });
});
