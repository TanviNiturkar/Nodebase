"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { memo, useState } from "react";
import {   SlackFormValues, SlackDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { SLACK_CHANNEL } from "@/inngest/channels/slack";
import { fetchslackRealtimeToken } from "./action";




type SlackNodeData = {
   webhookUrl? : string
   content? : string 
   username? : string
}

type SlackNodeType = Node<SlackNodeData> ;

export const SlackNode = memo((props : NodeProps<SlackNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : SLACK_CHANNEL,
        topic : "status",
        refreshToken : fetchslackRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : SlackFormValues)=>{
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
        <SlackDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon="/slack.svg" name="Slack"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

SlackNode.displayName = "SlackNode"