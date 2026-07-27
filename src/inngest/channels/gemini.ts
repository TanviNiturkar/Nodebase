import { Realtime , topic ,channel} from "@inngest/realtime" ;

export const GEMINI_CHANNEL = "gemini-execution" ;

// 2. Define the channel using the new object syntax
export const geminiChannel = channel(GEMINI_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        )
