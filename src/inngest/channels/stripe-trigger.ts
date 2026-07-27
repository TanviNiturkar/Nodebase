import { Realtime , topic ,channel} from "@inngest/realtime" ;
export const STRIPE_TRIGGER_CHANNEL = "stripe-trigger" ;

// 2. Define the channel using the new object syntax
export const stripeTriggerChannel = channel(STRIPE_TRIGGER_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>(),
    )

