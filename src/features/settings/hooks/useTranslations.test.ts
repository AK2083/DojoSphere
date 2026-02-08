import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useTranslations from "@features/settings/hooks/useTranslations";

import { useNamespaceToTranslate } from "@shared/hooks/useI18n";

vi.mock("@shared/hooks/useI18n", () => ({
  useNamespaceToTranslate: vi.fn(),
}));

describe("useTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useNamespaceToTranslate with 'settings'", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    renderHook(() => useTranslations());

    expect(useNamespaceToTranslate).toHaveBeenCalledWith("settings");
  });

  it("returns correct translation structure", () => {
    const mockTranslate = vi.fn((key: string) => `t:${key}`);

    (useNamespaceToTranslate as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      translate: mockTranslate,
    });

    const { result } = renderHook(() => useTranslations());

    expect(result.current.translations).toEqual({
      title: "t:title",
      language: {
        title: "t:language.title",
        description: "t:language.description",
      },
      theme: {
        title: "t:theme.title",
        description: "t:theme.description",
        tooltip: {
          light: "t:theme.tooltip.light",
          dark: "t:theme.tooltip.dark",
          system: "t:theme.tooltip.system",
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

    expect(mockTranslate).toHaveBeenCalledWith("title");
    expect(mockTranslate).toHaveBeenCalledWith("language.title");
    expect(mockTranslate).toHaveBeenCalledWith("language.description");
    expect(mockTranslate).toHaveBeenCalledWith("theme.title");
    expect(mockTranslate).toHaveBeenCalledWith("theme.description");
    expect(mockTranslate).toHaveBeenCalledWith("theme.tooltip.light");
    expect(mockTranslate).toHaveBeenCalledWith("theme.tooltip.dark");
    expect(mockTranslate).toHaveBeenCalledWith("theme.tooltip.system");
  });
});
