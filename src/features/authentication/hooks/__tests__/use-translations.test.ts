import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useTranslations from "@features/authentication/hooks/use-translations";
import { useNamespaceToTranslate } from "@shared/hooks/use-i18n";

vi.mock("@shared/hooks/use-i18n", () => ({
  useNamespaceToTranslate: vi.fn(),
}));

describe("useTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useNamespaceToTranslate with 'authentication'", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    renderHook(() => useTranslations());

    expect(useNamespaceToTranslate).toHaveBeenCalledWith("authentication");
  });

  it("returns correct translation structure", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    const { result } = renderHook(() => useTranslations());

    expect(result.current.translations).toEqual({
      useWithoutAuth: "t:title",
      form: {
        title: "t:form.title",
        description: "t:form.description",
        alreadyAccount: "t:form.alreadyAccount",
        logMeIn: "t:form.logMeIn",
        mail: {
          title: "t:form.mail.title",
          invalid: "t:form.mail.invalid",
        },
        password: {
          title: "t:form.password.title",
          invalid: "t:form.password.invalid",
          displayToggle: "t:form.password.displayToggle",
        },
        submit: "t:form.submit",
        error: {
          retry: "t:form.error.retry",
          unknown: "t:form.error.unknown",
        },
      },
    });
  });

  it("calls translate with all expected keys", () => {
    const mockTranslate = vi.fn((key: string) => key);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    renderHook(() => useTranslations());

    expect(mockTranslate).toHaveBeenCalledWith("form.title");
    expect(mockTranslate).toHaveBeenCalledWith("form.description");
    expect(mockTranslate).toHaveBeenCalledWith("form.alreadyAccount");
    expect(mockTranslate).toHaveBeenCalledWith("form.logMeIn");
    expect(mockTranslate).toHaveBeenCalledWith("form.submit");
    expect(mockTranslate).toHaveBeenCalledWith("form.error.retry");
    expect(mockTranslate).toHaveBeenCalledWith("form.error.unknown");
  });
});
