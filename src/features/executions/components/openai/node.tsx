"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { memo, useState } from "react";
import {  OpenAiDialog, OpenAiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";

import { OPENAI_CHANNEL } from "@/inngest/channels/openAi";

import {fetchOpenAiRealtimeToken} from "./action" ;


type OpenAiNodeData = {
    variableName? : string ;
    credentialId? : string ;
  // model? : typeof AVAILABLE_MODELS[number] ;
   systemPrompt? : string ;
   userPrompt? : string ;
}

type OpenAiNodeType = Node<OpenAiNodeData> ;

export const OpenAiNode = memo((props : NodeProps<OpenAiNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : OPENAI_CHANNEL,
        topic : "status",
        refreshToken : fetchOpenAiRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : OpenAiFormValues)=>{
        setNodes((nodes)=> nodes.map((node)=>{
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    }

                }
            }
            return node;
        }))

    }
    const nodeData = props.data ;
    const description = nodeData?.userPrompt 
    ?"gpt-4: " + nodeData.userPrompt.slice(0,50) + "..."
    : "NOt Configured" ;

    return (
        <>
        <OpenAiDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon="/openai.svg" name="OpenAI"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

OpenAiNode.displayName = "OpenAiNode"