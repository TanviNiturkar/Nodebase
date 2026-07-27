import { Realtime , topic ,channel} from "@inngest/realtime" ;


export const ANTHROPIC_CHANNEL = "Anthropic-execution" ;

// 2. Define the channel using the new object syntax
export const AnthropicChannel = channel(ANTHROPIC_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>(),
    )

