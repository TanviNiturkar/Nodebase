"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { memo, useState } from "react";
import {  GeminiDialog, GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";

import { fetchGeminiRealtimeToken } from "./action";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini";



type GeminiNodeData = {
    variableName? : string ;
    credentialId?:string
 // model? : "gemini-1.5" | "gemini-2.0" | "gemini-2.0-flash" | "gemini-2.0-32k" | "gemini-2.0-flash-32k" ;
   systemPrompt? : string ;
   userPrompt? : string ;
}

type GeminiNodeType = Node<GeminiNodeData> ;

export const GeminiNode = memo((props : NodeProps<GeminiNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : GEMINI_CHANNEL,
        topic : "status",
        refreshToken : fetchGeminiRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : GeminiFormValues)=>{
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
    ? "gemini-2.0-flash: " + nodeData.userPrompt.slice(0,50) + "..."
    : "NOt Configured" ;

    return (
        <>
        <GeminiDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon="/gemini.svg" name="Gemini"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

GeminiNode.displayName = "GeminiNode"