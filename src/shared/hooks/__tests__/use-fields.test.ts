import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useField } from "@shared/hooks/use-fields";
import type { Validator } from "@shared/types/validator";

describe("useField", () => {
  it("initializes with initial value and no error", () => {
    const { result } = renderHook(() => useField("initial"));

    expect(result.current.value).toBe("initial");
    expect(result.current.error).toBeNull();
  });

  it("updates value via setValue", () => {
    const { result } = renderHook(() => useField("initial"));

    act(() => {
      result.current.setValue("changed");
    });

    expect(result.current.value).toBe("changed");
  });

  it("validate returns true and sets no error when no validator is provided", () => {
    const { result } = renderHook(() => useField("value"));

    let isValid!: boolean;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("validate returns true when validator passes", () => {
    const validator: Validator<string> = vi.fn(() => null);

    const { result } = renderHook(() => useField("valid", validator));

    let isValid!: boolean;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
    expect(result.current.error).toBeNull();
    expect(validator).toHaveBeenCalledWith("valid");
  });

  it("validate returns false and sets error when validator fails", () => {
    const validator: Validator<string> = vi.fn(() => "required" as const);

    const { result } = renderHook(() => useField("required", validator));

    let isValid!: boolean;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(false);
    expect(result.current.error).toBe("required");
  });

  it("reset resets value and error to initial state", () => {
    const validator: Validator<string> = () => "invalid_password";

    const { result } = renderHook(() => useField<string>("initial", validator));

    act(() => {
      result.current.setValue("changed");
      result.current.validate();
    });

    expect(result.current.value).toBe("changed");
    expect(result.current.error).toBe("invalid_password");

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe("initial");
    expect(result.current.error).toBeNull();
  });

  it("works with non-string values (generic)", () => {
    const validator: Validator<number> = (v: number) => (v > 0 ? null : "invalid_password");

    const { result } = renderHook(() => useField<number>(0, validator));

    let isValid!: boolean;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(false);
    expect(result.current.error).toBe("invalid_password");

    act(() => {
      result.current.setValue(5);
    });

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
