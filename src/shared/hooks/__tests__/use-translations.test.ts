import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useNamespaceToTranslate } from "@shared/hooks/use-i18n";
import useTranslations from "@shared/hooks/use-translations";

vi.mock("@shared/hooks/use-i18n", () => ({
  useNamespaceToTranslate: vi.fn(),
}));

describe("useTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useNamespaceToTranslate with 'shared'", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    renderHook(() => useTranslations());

    expect(useNamespaceToTranslate).toHaveBeenCalledWith("shared");
  });

  it("returns correct translation structure", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    const { result } = renderHook(() => useTranslations());

    expect(result.current.translations).toEqual({
      mail: "t:mail",
      error: {
        required: "t:error.required",
        invalid_email: "t:error.invalid_email",
        invalid_password: "t:error.invalid_password",
      },
      password: {
        label: "t:password.label",
        toggle: "t:password.toggle",
        hints: {
          common: "t:password.hints.common",
          length: "t:password.hints.length",
          uppercase: "t:password.hints.uppercase",
          number: "t:password.hints.number",
          special: "t:password.hints.special",
        },
      },
      conjunction: "t:conjunction",
      contain: "t:contain",
    });
  });

  it("calls translate with all expected keys", () => {
    const mockTranslate = vi.fn((key: string) => key);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    renderHook(() => useTranslations());

    expect(mockTranslate).toHaveBeenCalledWith("mail");
    expect(mockTranslate).toHaveBeenCalledWith("error.required");
    expect(mockTranslate).toHaveBeenCalledWith("error.invalid_email");
    expect(mockTranslate).toHaveBeenCalledWith("error.invalid_password");
    expect(mockTranslate).toHaveBeenCalledWith("password.label");
    expect(mockTranslate).toHaveBeenCalledWith("password.toggle");
    expect(mockTranslate).toHaveBeenCalledWith("password.hints.common");
    expect(mockTranslate).toHaveBeenCalledWith("password.hints.length");
    expect(mockTranslate).toHaveBeenCalledWith("password.hints.uppercase");
    expect(mockTranslate).toHaveBeenCalledWith("password.hints.number");
    expect(mockTranslate).toHaveBeenCalledWith("password.hints.special");
    expect(mockTranslate).toHaveBeenCalledWith("conjunction");
    expect(mockTranslate).toHaveBeenCalledWith("contain");
  });
});
