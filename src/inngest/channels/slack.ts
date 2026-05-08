import { Inngest, realtime, staticSchema } from "inngest";



export const SLACK_CHANNEL = "slack-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const slackChannel = realtime.channel({
    name: SLACK_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
