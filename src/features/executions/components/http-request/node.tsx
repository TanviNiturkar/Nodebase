"use client" 
 
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node , NodeProps , useReactFlow} from "@xyflow/react"
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import {httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./action";



type HttpRequestNodeData = {
    variableName? : string ;
    endpoint? : string ;
    method? : "GET" | "POST" | "PUT" | "PATCH"| "DELETE";
    body? : string ;
   [key:string] : unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData> ;

export const HttpRequestNode = memo((props : NodeProps<HttpRequestNodeType>)=>{
    const  [dialogOpen , setDialogOpen] = useState(false) ;
    const { setNodes , setEdges} = useReactFlow();
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : httpRequestChannel().name,
        topic : "status",
        refreshToken : fetchHttpRequestRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    const handleSubmit = (values : HttpRequestFormValues)=>{
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
    const description = nodeData?.endpoint 
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "NOt Configured" ;

    return (
        <>
        <HttpRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData}/>
        <BaseExecutionNode {...props} id={props.id} icon={GlobeIcon} name="HTTP Request"
        description={description} status={nodeStatus} onDoubleClick={handleOpenSettings} onSettings={handleOpenSettings}
        />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"