import { describe, it, expect } from "vitest";

import type { Validator } from "@shared/types/validator";
import {
  required,
  emailValidator,
  passwordValidator,
  composeValidators,
} from "@shared/utils/validators";

describe("composeValidators", () => {
  it("returns error from first failing validator", () => {
    const v1: Validator<string> = () => "required";
    const v2: Validator<string> = () => "invalid_email";

    const composed = composeValidators(v1, v2);

    expect(composed("test")).toBe("required");
  });

  it("returns error from second validator if first passes", () => {
    const v1: Validator<string> = () => null;
    const v2: Validator<string> = () => "invalid_email";

    const composed = composeValidators(v1, v2);

    expect(composed("test")).toBe("invalid_email");
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
    expect(required("")).toBe("required");
  });

  it("returns error if value is undefined-like", () => {
    // @ts-expect-error – absichtlich falscher Typ
    expect(required(undefined)).toBe("required");
  });

  it("returns null if value is non-empty", () => {
    expect(required("test")).toBeNull();
  });
});

describe("emailValidator", () => {
  it("returns error if email is empty", () => {
    expect(emailValidator("")).toBe("invalid_email");
  });

  it("returns error if email is invalid", () => {
    expect(emailValidator("invalid_email")).toBe("invalid_email");
    expect(emailValidator("test@")).toBe("invalid_email");
    expect(emailValidator("test@test")).toBe("invalid_email");
  });

  it("returns null if email is valid", () => {
    expect(emailValidator("test@test.de")).toBeNull();
    expect(emailValidator("user.name+tag@example.com")).toBeNull();
  });
});

describe("passwordValidator", () => {
  it("returns error if password is empty", () => {
    expect(passwordValidator("")).toBe("required");
  });

  it("returns error if password does not fulfill rules", () => {
    expect(passwordValidator("Abcdefg1")).toBe("invalid_password");
  });

  it("returns null if all rules are fulfilled", () => {
    expect(passwordValidator("Abcdef1!")).toBeNull();
  });

  it("currently never returns an error", () => {
    expect(passwordValidator("anything")).toBe("invalid_password");
  });
});
