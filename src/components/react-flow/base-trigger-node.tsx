"use client"

import { type NodeProps , Position, useReactFlow } from "@xyflow/react"
import { Icon, LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react"

import Image from "next/image";
import { WorkflowNode } from "../workflow-node";
import { BaseNode, BaseNodeContent } from "./base-node";
import { BaseHandle } from "./base-handle";
import { type NodeStatus, NodeStatusIndicator } from "./node-status-indicator";



interface BaseTriggerNodeProps extends NodeProps {
    icon : LucideIcon | string ;
    name : string ;
    description? : string ;
    children? : ReactNode ;
    status?:NodeStatus;
    onSettings?: ()=> void ;
    onDoubleClick? : ()=> void ;
}


export const BaseTriggerNode = memo(

    ({
        id  , icon: Icon , name ,description , children ,status="initial",onDoubleClick,onSettings
    } : BaseTriggerNodeProps)=> {
            const { setNodes , setEdges} = useReactFlow();
            const handleDelete = () => {
                setNodes((currentNodes) =>{
                    const updateNodes = currentNodes.filter((node)=> node.id !== id);
                    return updateNodes
                });
                setEdges((currentEdges) =>{
                    const updatedEdges = currentEdges.filter((edge) =>
                    edge.source !== id && edge.target !== id);
                    return updatedEdges
                })
            }


        return (


            <WorkflowNode  name={name} description={description} onDelete={handleDelete} onSettings={onSettings}>
                
                <NodeStatusIndicator status={status} variant="border" className="rounded-l-2xl" >
                
                <BaseNode status={status} onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent >
                {typeof Icon === "string" ? (
                    <Image src={Icon} 
                    alt={name} 
                    width={16} 
                    height={16}/>
                ) : (
                    <Icon className="size-4 text-muted-foreground" />
                )}
                {children}
               
                <BaseHandle id="source-1" type="source" position={Position.Right} />

                
                </BaseNodeContent></BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        )
    }
)


BaseTriggerNode.displayName = "BaseTriggerNode"