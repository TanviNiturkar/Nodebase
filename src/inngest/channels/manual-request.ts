import { Inngest, realtime, staticSchema } from "inngest";




export const MANUAL_TRIGGER_CHANNEL = "manual-trigger-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const manualTriggerChannel = realtime.channel({
    name: MANUAL_TRIGGER_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
