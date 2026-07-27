
"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { MANUAL_TRIGGER_CHANNEL, manualTriggerChannel } from "@/inngest/channels/manual-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

// Use ReturnType to get the token type automatically
export type ManualTriggerToken = Realtime.Token<
  typeof manualTriggerChannel,
  ["status"]
>;

export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {
   const token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });
   return token;
}
