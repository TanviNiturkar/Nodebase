"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import {  DiscordDialog, DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL, httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchDiscordRealtimeToken } from "./action";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini";
import { fetchGeminiRealtimeToken } from "@/features/triggers/components/manualTrigger/action";
import { DISCORD_CHANNEL } from "@/inngest/channels/discord";



type DiscordNodeData = {
   webhookUrl? : string
   content? : string 
   username? : string
}

type DiscordNodeType = Node<DiscordNodeData> ;

export const DiscordNode = memo((props : NodeProps<DiscordNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : DISCORD_CHANNEL,
        topic : "status",
        refreshToken : fetchDiscordRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : DiscordFormValues)=>{
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
    const description = nodeData?.content 
    ? `Send : ${nodeData.content.slice(0,50)}...`
    : "NOt Configured" ;

    return (
        <>
        <DiscordDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon="/discord.svg" name="Discord"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

DiscordNode.displayName = "DiscordNode"