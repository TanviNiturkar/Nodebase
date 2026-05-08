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
import { SLACK_CHANNEL } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "inngest/realtime";

// Use ReturnType to get the token type automatically
export type slackToken = Awaited<ReturnType<typeof getSubscriptionToken>>;

export async function fetchslackRealtimeToken(): Promise<slackToken> {
    return await getSubscriptionToken(inngest, {
        channel: SLACK_CHANNEL,
        topics: ["status"],
    });
}
