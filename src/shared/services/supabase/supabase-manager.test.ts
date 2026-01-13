import { describe, it, expect, vi, beforeEach } from "vitest";

import { RegistrationFailedException } from "@features/authentication/exceptions/RegistrationFailedException";
import { TooManyRequestsException } from "@features/authentication/exceptions/TooManyRequestsException";

import { signUpNewUser } from "@shared/services/supabase/supabase-manager";

const signUpMock = vi.hoisted(() => vi.fn());

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: signUpMock,
    },
  })),
}));

describe("signUpNewUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data when signup is successful", async () => {
    const fakeResponse = {
      data: {
        user: { email: "test@test.de" },
        session: {},
      },
      error: null,
    };

    signUpMock.mockResolvedValue(fakeResponse);

    const result = await signUpNewUser("test@test.de", "Valid123!");

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@test.de",
      password: "Valid123!",
    });

    expect(result).toEqual(fakeResponse.data);
  });

  it("throws TooManyRequestsException when status is 429", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: {
        status: 429,
        message: "Too many requests",
      },
    });

    await expect(signUpNewUser("test@test.de", "Valid123!")).rejects.toBeInstanceOf(
      TooManyRequestsException,
    );
  });

  it("throws RegistrationFailedException for other errors", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: {
        status: 500,
        message: "Internal Server Error",
      },
    });

    await expect(signUpNewUser("test@test.de", "Valid123!")).rejects.toBeInstanceOf(
      RegistrationFailedException,
    );
  });

  it("throws RegistrationFailedException when error has no status", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: {
        message: "Unknown error",
      },
    });

    await expect(signUpNewUser("test@test.de", "Valid123!")).rejects.toBeInstanceOf(
      RegistrationFailedException,
    );
  });
});
