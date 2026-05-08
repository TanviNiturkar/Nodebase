"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { memo, useState } from "react";
import {  AnthropicDialog, AnthropicFormValues} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import {fetchAnthropicRealtimeToken} from "./action" ;
import { ANTHROPIC_CHANNEL } from "@/inngest/channels/anthropic";


type AnthropicNodeData = {
    variableName? : string ;
    credentialId? : string
  // model? : typeof AVAILABLE_MODELS[number] ;
   systemPrompt? : string ;
   userPrompt? : string ;
}

type AnthropicNodeType = Node<AnthropicNodeData> ;

export const AnthropicNode = memo((props : NodeProps<AnthropicNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : ANTHROPIC_CHANNEL,
        topic : "status",
        refreshToken : fetchAnthropicRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : AnthropicFormValues)=>{
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
    ?"claude-sonnet-4-5: " + nodeData.userPrompt.slice(0,50) + "..."
    : "NOt Configured" ;

    return (
        <>
        <AnthropicDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon="/anthropic.svg" name="Anthropic"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

AnthropicNode.displayName = "AnthropicNode"