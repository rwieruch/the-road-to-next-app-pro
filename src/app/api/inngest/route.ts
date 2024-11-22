import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [], // TODO: register functions
});
