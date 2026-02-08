import { renderHook } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useNamespaceToTranslate, useSelectedTranslation } from "@shared/hooks/useI18n";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

describe("useNamespaceToTranslate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useTranslation with namespace and returns translate function", () => {
    const mockT = vi.fn((key: string) => `translated:${key}`);

    (useTranslation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      t: mockT,
    });

    const { result } = renderHook(() => useNamespaceToTranslate("auth"));

    expect(useTranslation).toHaveBeenCalledWith("auth");
    expect(result.current.translate).toBe(mockT);
    expect(result.current.translate("login")).toBe("translated:login");
  });
});

describe("useSelectedTranslation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns resolvedLanguage if available", () => {
    const changeLanguage = vi.fn();

    (useTranslation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      i18n: {
        resolvedLanguage: "de",
        language: "en",
        changeLanguage,
      },
    });

    const { result } = renderHook(() => useSelectedTranslation());

    expect(result.current.language).toBe("de");
  });

  it("falls back to language if resolvedLanguage is undefined", () => {
    const changeLanguage = vi.fn();

    (useTranslation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      i18n: {
        resolvedLanguage: undefined,
        language: "en",
        changeLanguage,
      },
    });

    const { result } = renderHook(() => useSelectedTranslation());

    expect(result.current.language).toBe("en");
  });

  it("calls changeLanguage correctly", () => {
    const changeLanguage = vi.fn();

    (useTranslation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      i18n: {
        resolvedLanguage: "en",
        language: "en",
        changeLanguage,
      },
    });

    const { result } = renderHook(() => useSelectedTranslation());

    result.current.changeLanguage("de");

    expect(changeLanguage).toHaveBeenCalledWith("de");
  });
});
