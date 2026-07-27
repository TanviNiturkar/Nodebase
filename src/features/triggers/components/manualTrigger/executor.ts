
import { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualTriggerChannel } from "@/inngest/channels/manual-request";


type ManualTriggerData = Record<string, unknown>; 
export const manualTriggerExecutor : NodeExecutor<ManualTriggerData> = async({
    
    context,
    step,
    nodeId,
        publish,
})=> {
   await publish(manualTriggerChannel().status({
         nodeId,
         status: "loading",
     })) ;
 
        const result = await step.run(`manual-trigger-${nodeId}`, async()=>{
            return context;
        })
  await publish(manualTriggerChannel().status({
        nodeId,
        status: "success",
    })) ;

        return result;
}