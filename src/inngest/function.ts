// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecuter } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-request";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openAi";
import { ANTHROPIC_CHANNEL, AnthropicChannel } from "./channels/anthropic";
import { DiscordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";




export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries:0 ,
     onFailure: async ({ event,step}) =>{ return prisma.execution.update({ where: { inngestEventId : event.data.event.id}, data : { status : ExecutionStatus.FAILED , error : event.data.error.message, errorStack : event.data.error.stack}})},
     triggers: { event: "workflows/execute.workflow" , channels : [
    httpRequestChannel, manualTriggerChannel, googleFormTriggerChannel, stripeTriggerChannel,geminiChannel,openAiChannel,AnthropicChannel,DiscordChannel,slackChannel
  ] } ,
 },
  async ({ event, step }) => {
    const inngestEventId = event.id ;
     const workflowId = event.data.workflowId;

     if(!inngestEventId || !workflowId){
      throw new NonRetriableError("Event ID or Workflow ID is required to execute workflow");
      }
      await step.run("create-execution",async()=>{
        return prisma.execution.create({
        data : {
          workflowId,
          inngestEventId ,
        },
        });
      });

      const sortedNodes = await step.run("prepare-workflow" , async()=>{
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where : {id : workflowId},
          include : {
            nodes : true ,
            edges : true ,
            connections : true ,
          }
        })
       
        return topologicalSort(workflow.nodes, workflow.connections);
      });

      const userId = await step.run("find-user-id",async()=>{
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {id : workflowId},
          select : {
            userId : true ,
          }
        })
        return workflow.userId
      })
      let context=  event.data.initialData || {};

      for(const node of sortedNodes){
        const executor = getExecuter(node.type as NodeType);
        context = await executor({
          data : node.data as Record<string, unknown>,
          nodeId : node.id,
          workflowId,
          userId ,
          context,
          step ,
          publish : step.realtime.publish, 
        })
      }
     

      await step.run("update-execution", async()=>{
        return prisma.execution.update({
          where : {
            inngestEventId , workflowId
          },
          data : {
            status : ExecutionStatus.SUCCESS,
            completedAt : new Date(),
            output : context 
          }

        })
      })

    return {
      workflowId,
      result : context,
    }
    });

   