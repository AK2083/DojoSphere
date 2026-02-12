import { describe, it, expect, vi, beforeEach } from "vitest";

import { captureException } from "@shared/services/sentry-manager";
import { signUpNewUser } from "@shared/services/supabase-manager";
import { ApiErrorCode } from "@shared/types/api-error-code";

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

  it("returns ApiResult with user data when signup is successful", async () => {
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

    expect(result).toEqual({
      success: true,
      data: { email: "test@test.de" },
    });
  });

  it("returns RATE_LIMITED error on 429 response", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: { status: 429 },
    });

    const result = await signUpNewUser("test@test.de", "Valid123!");

    expect(result).toEqual({
      success: false,
      error: {
        code: ApiErrorCode.RATE_LIMITED,
      },
    });
  });

  it("throws if no user is returned", async () => {
    signUpMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(signUpNewUser("test@test.de", "Valid123!")).rejects.toThrow("Invariant violated");
  });

  it("returns CONFLICT error on non-429 error", async () => {
    signUpMock.mockResolvedValue({
      data: null,
      error: { status: 400 },
    });

    const result = await signUpNewUser("test@test.de", "Valid123!");

    expect(result).toEqual({
      success: false,
      error: {
        code: ApiErrorCode.CONFLICT,
      },
    });
  });

  it("calls captureException on 500 error", async () => {
    vi.mock("@shared/services/sentry-manager", () => ({
      captureException: vi.fn(),
      setUserContext: vi.fn(),
    }));

    signUpMock.mockResolvedValue({
      data: null,
      error: { status: 500, message: "Server error" },
    });

    await signUpNewUser("test@test.de", "Valid123!");

    expect(captureException).toHaveBeenCalled();
  });
});
