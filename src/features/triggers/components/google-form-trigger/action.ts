
"use server";

import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { manualTriggerChannel } from "@/inngest/channels/manual-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken ,  Realtime ,channel} from "@inngest/realtime";

// Use ReturnType to get the token type automatically
export type googleFormTriggerToken = Realtime.Token<
  typeof googleFormTriggerChannel,
  ["status"]
>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<googleFormTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel(),
        topics: ["status"],
    });
    return token;
}
