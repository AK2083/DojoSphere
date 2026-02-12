import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useSignUp from "@shared/hooks/useSignUp";
import { signUpNewUser } from "@shared/services/supabase/supabase-manager";
import type { AppUser } from "@shared/types/app-user";

vi.mock("@shared/services/supabase/supabase-manager", () => ({
  signUpNewUser: vi.fn(),
}));

const mockedSignUpNewUser = vi.mocked(signUpNewUser);

type SignUpResult = Awaited<ReturnType<typeof signUpNewUser>>;

describe("useSignUp", () => {
  beforeEach(() => {
    mockedSignUpNewUser.mockReset();
  });

  it("sets registering to true while signup is in progress", async () => {
    let resolvePromise!: (value: SignUpResult) => void;

    mockedSignUpNewUser.mockImplementation(
      () =>
        new Promise<SignUpResult>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.signUp("test@test.de", "Valid123!");
    });

    expect(result.current.registering).toBe(true);

    await act(async () => {
      resolvePromise({
        success: true,
        data: null as unknown as AppUser,
      });
    });

    await waitFor(() => {
      expect(result.current.registering).toBe(false);
    });
  });
});
