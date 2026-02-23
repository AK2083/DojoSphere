import { addBreadcrumb } from "@lib/sentry/sentry-manager";

export const CATEGORY = "authentication";

export const MONITORING_EVENTS = {
  AUTH_REGISTER_SUBMITTED: "auth.register.submitted",
};

export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, "info", data);
}
