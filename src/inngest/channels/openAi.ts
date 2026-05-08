import { Inngest, realtime, staticSchema } from "inngest";



export const OPENAI_CHANNEL = "openai-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const openAiChannel = realtime.channel({
    name: OPENAI_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
