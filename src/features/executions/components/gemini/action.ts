// "use server"
// import { httpRequestChannel } from "@/inngest/channels/http-request"
// import { inngest } from "@/inngest/client";
// import { type Realtime , getSubscriptionToken  } from "inngest/realtime"

 


// export type HttpRequestToken = Realtime.Token<
// typeof httpRequestChannel,
// ["status"]

// >;

// export async function fetchHttpRequestRealtimeToken() : Promise<HttpRequestToken>{
//     const token = await getSubscriptionToken(inngest, {
//         channel : httpRequestChannel,
//         topics : ["status"],
//     })

//     return token
// }


"use server";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "inngest/realtime";

// Use ReturnType to get the token type automatically
export type HttpRequestToken = Awaited<ReturnType<typeof getSubscriptionToken>>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
    return await getSubscriptionToken(inngest, {
        channel: GEMINI_CHANNEL,
        topics: ["status"],
    });
}
