import { Inngest, realtime, staticSchema } from "inngest";




export const STRIPE_TRIGGER_CHANNEL = "stripe-trigger" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const stripeTriggerChannel = realtime.channel({
    name: STRIPE_TRIGGER_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
