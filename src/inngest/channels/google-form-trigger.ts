import {Realtime, channel, topic} from "@inngest/realtime" ;


export const GOOGLE_FORM_TRIGGER_CHANNEL = "google-form-trigger" ;

// 2. Define the channel using the new object syntax
export const googleFormTriggerChannel = channel(GOOGLE_FORM_TRIGGER_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        )
