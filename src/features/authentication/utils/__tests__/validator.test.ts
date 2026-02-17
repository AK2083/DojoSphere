import { describe, it, expect } from "vitest";

import { ValidationErrorCode } from "@features/authentication/types/validation-errors";
import { EMailValidator, PasswordValidator } from "@features/authentication/utils/validator";

describe("EMailValidator", () => {
  it("should return undefined for a valid email", () => {
    expect(EMailValidator("test@example.com")).toBeUndefined();
  });

  it("should return INVALID_EMAIL for missing @", () => {
    expect(EMailValidator("testexample.com")).toBe(ValidationErrorCode.INVALID_EMAIL);
  });

  it("should return INVALID_EMAIL for missing domain", () => {
    expect(EMailValidator("test@")).toBe(ValidationErrorCode.INVALID_EMAIL);
  });

  it("should return INVALID_EMAIL for empty string", () => {
    expect(EMailValidator("")).toBe(ValidationErrorCode.INVALID_EMAIL);
  });

  it("should return INVALID_EMAIL for email with spaces", () => {
    expect(EMailValidator("test @example.com")).toBe(ValidationErrorCode.INVALID_EMAIL);
  });
});

describe("PasswordValidator", () => {
  const validPassword = "verysecure123";

  it("should return undefined for valid password (>= 12 chars)", () => {
    expect(PasswordValidator(validPassword)).toBeUndefined();
  });

  it("should return INVALID_PASSWORD for empty string", () => {
    expect(PasswordValidator("")).toBe(ValidationErrorCode.INVALID_PASSWORD);
  });

  it("should return INVALID_PASSWORD for whitespace only", () => {
    expect(PasswordValidator("     ")).toBe(ValidationErrorCode.INVALID_PASSWORD);
  });

  it("should return INVALID_PASSWORD for less than 12 characters", () => {
    expect(PasswordValidator("short123")).toBe(ValidationErrorCode.INVALID_PASSWORD);
  });

  it("should trim password before validating length", () => {
    expect(PasswordValidator("   short123   ")).toBe(ValidationErrorCode.INVALID_PASSWORD);
  });

  it("should accept password with leading/trailing spaces if trimmed length >= 12", () => {
    expect(PasswordValidator("   verysecure123   ")).toBeUndefined();
  });
});
