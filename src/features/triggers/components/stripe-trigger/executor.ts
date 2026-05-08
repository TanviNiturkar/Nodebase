


import { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-request";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { step } from "inngest";


type StripeTriggerData = Record<string, unknown>; 
export const stripeTriggerExecutor : NodeExecutor<StripeTriggerData> = async({
    
    context,
    step,
    nodeId,
        publish,
})=> {
    await publish(stripeTriggerChannel, "status", {
    nodeId,
    status: "loading"
});

        const result = await step.run(`stripe-trigger-${nodeId}`, async()=>{
            return context;
        })

        return result;
}