import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    externalResolver: true,
  },
};

// Legacy Realtime Database -> Firestore migration endpoint. The migration
// logic was removed; this handler is now a no-op.
export default async (req: NextApiRequest, resolve: NextApiResponse) => {};
