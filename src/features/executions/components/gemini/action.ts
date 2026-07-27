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

import { inngest } from "@/inngest/client";
import { getSubscriptionToken ,Realtime} from "@inngest/realtime";
import { geminiChannel } from "@/inngest/channels/gemini";
// Use ReturnType to get the token type automatically
export type GeminiToken =Realtime.Token<
  typeof geminiChannel,
  ["status"]
>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: geminiChannel(),
        topics: ["status"],
    });
    return token;
}
