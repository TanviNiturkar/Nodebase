
import { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

import { step } from "inngest";


type GoogleFormTriggerData = Record<string, unknown>; 
export const GoogleFormTriggerExecutor : NodeExecutor<GoogleFormTriggerData> = async({
    
    context,
    step,
    nodeId,
        publish,
})=> {
    await publish(googleFormTriggerChannel, "status", {
    nodeId,
    status: "loading"
});

        const result = await step.run(`google-form-${nodeId}`, async()=>{
            return context;
        })

        return result;
}