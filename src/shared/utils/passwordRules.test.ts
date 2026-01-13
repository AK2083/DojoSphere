import { describe, it, expect } from "vitest";

import { getPasswordRules } from "./passwordRules";

describe("getPasswordRules", () => {
  it("fails all rules for empty password", () => {
    expect(getPasswordRules("")).toEqual({
      letters: false,
      numbers: false,
      special: false,
      length: false,
    });
  });

  it("fails length rule for short password", () => {
    expect(getPasswordRules("Ab1!")).toMatchObject({
      letters: true,
      numbers: true,
      special: true,
      length: false,
    });
  });

  it("fails if no letters are present", () => {
    expect(getPasswordRules("12345678!")).toMatchObject({
      letters: false,
      numbers: true,
      special: true,
      length: true,
    });
  });

  it("fails if no numbers are present", () => {
    expect(getPasswordRules("Abcdefg!")).toMatchObject({
      letters: true,
      numbers: false,
      special: true,
      length: true,
    });
  });

  it("fails if no special characters are present", () => {
    expect(getPasswordRules("Abcdefg1")).toMatchObject({
      letters: true,
      numbers: true,
      special: false,
      length: true,
    });
  });

  it("passes all rules for a valid password", () => {
    expect(getPasswordRules("Abcdef1!")).toEqual({
      letters: true,
      numbers: true,
      special: true,
      length: true,
    });
  });
});
