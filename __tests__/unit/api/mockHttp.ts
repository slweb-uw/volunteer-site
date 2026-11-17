import type { NextApiRequest, NextApiResponse } from "next";

// Minimal stand-ins for Next's request/response objects, enough for the API
// route handlers under test. Avoids adding a mocking library.

export function mockReq(opts: {
  method?: string;
  token?: string;
  authorization?: string;
  body?: unknown;
}): NextApiRequest {
  const headers: Record<string, string> = {};
  if (opts.authorization !== undefined) headers.authorization = opts.authorization;
  else if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  return { method: opts.method ?? "POST", headers, body: opts.body ?? {} } as unknown as NextApiRequest;
}

export type MockRes = NextApiResponse & {
  statusCode: number;
  body: any;
  headersSet: Record<string, string>;
};

export function mockRes(): MockRes {
  const res: any = { statusCode: 200, body: undefined, headersSet: {} };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body: unknown) => {
    res.body = body;
    return res;
  };
  res.setHeader = (name: string, value: string) => {
    res.headersSet[name] = value;
    return res;
  };
  return res as MockRes;
}
