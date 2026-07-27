import { Realtime , topic ,channel} from "@inngest/realtime" ;

export const SLACK_CHANNEL = "slack-execution" ;

// 2. Define the channel using the new object syntax
export const slackChannel = channel(SLACK_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
                status: "loading" | "success" | "error";
            }>() )
