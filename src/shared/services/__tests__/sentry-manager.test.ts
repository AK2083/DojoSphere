import * as Sentry from "@sentry/browser";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  setUserContext,
  setContext,
  captureException,
  addBreadcrumb,
} from "@shared/services//sentry-manager";

vi.mock("@sentry/browser", () => ({
  setUser: vi.fn(),
  setContext: vi.fn(),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

describe("sentry-manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setUserContext", () => {
    it("calls Sentry.setUser with user id", () => {
      setUserContext({ id: "123" });

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: "123" });
    });

    it("calls Sentry.setUser with undefined id when null", () => {
      setUserContext(null);

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: undefined });
    });
  });

  describe("setContext", () => {
    it("calls Sentry.setContext with TodoState data", () => {
      const todos = [{ id: 1 }, { id: 2 }];

      setContext(todos, "active");

      expect(Sentry.setContext).toHaveBeenCalledWith("TodoState", {
        count: 2,
        filter: "active",
      });
    });
  });

  describe("captureException", () => {
    it("calls Sentry.captureException with tags and extra", () => {
      const error = new Error("boom");

      captureException(error, "TodoService", "createTodo");

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        tags: {
          service: "TodoService",
          action: "createTodo",
        },
        extra: {
          status: "boom",
        },
      });
    });
  });

  describe("addBreadcrumb", () => {
    it("calls Sentry.addBreadcrumb with correct params", () => {
      addBreadcrumb("todo.created", "todo", "info", { id: 1 });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: "todo",
        message: "todo.created",
        level: "info",
        data: { id: 1 },
      });
    });

    it("works without optional data", () => {
      addBreadcrumb("todo.created", "todo", "info");

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: "todo",
        message: "todo.created",
        level: "info",
        data: undefined,
      });
    });
  });
});
