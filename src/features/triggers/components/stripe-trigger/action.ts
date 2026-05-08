
"use server";


import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "inngest/realtime";

// Use ReturnType to get the token type automatically
export type StripeTriggerToken = Awaited<ReturnType<typeof getSubscriptionToken>>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerToken> {
    return await getSubscriptionToken(inngest, {
        channel: stripeTriggerChannel,
        topics: ["status"],
    });
}
