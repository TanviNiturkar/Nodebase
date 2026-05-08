// import { inngest } from "@/inngest/client";
// import { GetStepTools, Inngest, Realtime } from "inngest";




// export type WorkflowContext = Record<string, unknown>;
// type ActualStepTools = GetStepTools<typeof inngest> ;

// //export type StepTools = GetStepTools<Inngest.Any> ;

// export interface NodeExecutorParams<TData = Record<string, unknown>> {
//     data : TData;
//     nodeId : string;
//     workflowId : string;
//     context : WorkflowContext;
//     step : ActualStepTools;
//     publish : (...args : Parameters<ActualStepTools["realtime"]["publish"]>)=> Promise<any>;
// }

// export type NodeExecutor<TData = Record<string, unknown>> = (params: NodeExecutorParams<TData>) => Promise<WorkflowContext> | WorkflowContext;



import { inngest } from "@/inngest/client";
import { GetStepTools } from "inngest";

export type WorkflowContext = Record<string, unknown>;
type ActualStepTools = GetStepTools<typeof inngest>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
    data: TData;
    nodeId: string;
    userId : string ;
    workflowId: string;
    context: WorkflowContext;
    step: ActualStepTools;
    // THE NUCLEAR FIX: Define the function signature manually 
    // to stop the internal "Property id is missing" error.
    publish: (channel: any, topic: any, data: any) => Promise<any>;
}

export type NodeExecutor<TData = Record<string, unknown>> = 
  (params: NodeExecutorParams<TData>) => Promise<WorkflowContext> | WorkflowContext;
