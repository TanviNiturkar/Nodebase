import { channel , topic} from "@inngest/realtime" ;


export const MANUAL_TRIGGER_CHANNEL = "manual-trigger-execution" ;

// 2. Define the channel using the new object syntax
export const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL)
    .addTopic(topic("status").type<{
        nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        )
