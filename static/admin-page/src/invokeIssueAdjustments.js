import { invoke } from "@forge/bridge";

export async function invokeIssueAdjustments(endpoint, payload) {
  return invoke(endpoint, payload);
}
