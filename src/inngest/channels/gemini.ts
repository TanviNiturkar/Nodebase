import { Inngest, realtime, staticSchema } from "inngest";



export const GEMINI_CHANNEL = "gemini-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const geminiChannel = realtime.channel({
    name: GEMINI_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
