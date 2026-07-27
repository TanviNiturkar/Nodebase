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
import { OPENAI_CHANNEL, openAiChannel } from "@/inngest/channels/openAi";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken  , Realtime } from "@inngest/realtime";

// Use ReturnType to get the token type automatically
export type OpenAiToken = Realtime.Token<
  typeof openAiChannel,
  ["status"]
>;

export async function fetchOpenAiRealtimeToken(): Promise<OpenAiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel:openAiChannel(),
        topics: ["status"],
    });
    return token;
}
