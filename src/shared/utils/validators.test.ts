import { describe, it, expect } from "vitest";

import {
  required,
  emailValidator,
  passwordValidator,
  type Validator,
  composeValidators,
} from "@shared/utils/validators";

describe("composeValidators", () => {
  it("returns error from first failing validator", () => {
    const v1: Validator<string> = () => "Error 1";
    const v2: Validator<string> = () => "Error 2";

    const composed = composeValidators(v1, v2);

    expect(composed("test")).toBe("Error 1");
  });

  it("returns error from second validator if first passes", () => {
    const v1: Validator<string> = () => null;
    const v2: Validator<string> = () => "Error 2";

    const composed = composeValidators(v1, v2);

    expect(composed("test")).toBe("Error 2");
  });

  it("returns null if all validators pass", () => {
    const v1: Validator<string> = () => null;
    const v2: Validator<string> = () => null;

    const composed = composeValidators(v1, v2);

    expect(composed("test")).toBeNull();
  });

  it("returns null if no validators are provided", () => {
    const composed = composeValidators<string>();

    expect(composed("test")).toBeNull();
  });
});

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
    expect(emailValidator("")).toBe("Ungültige E-Mail");
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
  it("returns null if password is empty", () => {
    expect(passwordValidator("")).toBeNull();
  });

  it("returns null if password does not fulfill rules", () => {
    expect(passwordValidator("Abcdefg1")).toBeNull();
  });

  it("returns null if all rules are fulfilled", () => {
    expect(passwordValidator("Abcdef1!")).toBeNull();
  });

  it("currently never returns an error", () => {
    expect(passwordValidator("anything")).toBeNull();
  });
});
