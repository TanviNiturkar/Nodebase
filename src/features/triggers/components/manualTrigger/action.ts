
"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { manualTriggerChannel } from "@/inngest/channels/manual-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "inngest/realtime";

// Use ReturnType to get the token type automatically
export type GeminiToken = Awaited<ReturnType<typeof getSubscriptionToken>>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {
    return await getSubscriptionToken(inngest, {
        channel: geminiChannel,
        topics: ["status"],
    });
}
