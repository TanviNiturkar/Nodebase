import { BaseTriggerNode } from "@/components/react-flow/base-trigger-node";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

import { fetchStripeTriggerRealtimeToken } from "./action";
import { STRIPE_TRIGGER_CHANNEL } from "@/inngest/channels/stripe-trigger";


export const StripeTriggerNode = memo((props: NodeProps) =>{

    const [dialogOpen , setDialogOpen] =useState(false )
const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : STRIPE_TRIGGER_CHANNEL,
        topic : "status",
        refreshToken : fetchStripeTriggerRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    return (
        <>
        <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode 
        {...props}
        icon="/stripe.svg"
        name="Stripe"
        description="When Stripe event occurs"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        
        
        />

        </>
    )
})