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
import { DiscordChannel } from "@/inngest/channels/discord";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken,Realtime } from "@inngest/realtime";

// Use ReturnType to get the token type automatically
export type DiscordToken = Realtime.Token<
  typeof DiscordChannel,
  ["status"]
>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
    return await getSubscriptionToken(inngest, {
        channel: DiscordChannel(),
        topics: ["status"],
    });
}
