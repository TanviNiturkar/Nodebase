
"use server";

import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { manualTriggerChannel } from "@/inngest/channels/manual-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "inngest/realtime";

// Use ReturnType to get the token type automatically
export type googleFormTriggerToken = Awaited<ReturnType<typeof getSubscriptionToken>>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<googleFormTriggerToken> {
    return await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel,
        topics: ["status"],
    });
}
