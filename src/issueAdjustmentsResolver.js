import api, { APIResponse, route } from "@forge/api";
import {
  IssueAdjustmentsEndpoints,
  IssueAdjustmentsMethod,
} from "./constants";

export const logJson = (content, context = "") => {
  console.log(context, JSON.stringify(content, null, 2));
}

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function issueAdjustmentResolver(
  endpoint,
  payload
) {
  const params = new URLSearchParams();

  if ("expands" in payload) {
    let expands = [];
    if ("data" in payload.expands) {
      expands.push("data");
    }
    if ("contexts" in payload.expands) {
      expands.push("contexts");
    }

    if (expands.length) {
      params.append("expand", expands.join(","));
    }
  }

  let requestURL;

  let url = IssueAdjustmentsEndpoints[endpoint];

  if ("contextId" in payload) {
    url = url.replace("{contextId}", payload.contextId);
  }
  if ("id" in payload) {
    url = url.replace("{issueAdjustmentId}", payload.id);
  }

  requestURL = route`${url}?${params}`;

  console.log("Request URL", requestURL);
  console.log("Method", IssueAdjustmentsMethod[endpoint]);

  const request = {
    method: IssueAdjustmentsMethod[endpoint],
    headers: {
      ...jsonHeaders,
    },
    body: null,
  };

  if ("body" in payload) {
    request.body = JSON.stringify(payload.body);
  }

  logJson(request.body, "body");

  const res = await api.asApp().requestJira(requestURL, request);

  const status = res;
  const data = await res.text();

  logJson(status, requestURL);

  return { status, data };
}

export function defineIssueAdjustments(resolver) {
  Object.keys(IssueAdjustmentsEndpoints).map((endpoint) => {
    resolver.define(endpoint, async ({ payload: resolverPayload }) => {
      const payload = resolverPayload;
      return await issueAdjustmentResolver(endpoint, payload);
    });
  });
}
