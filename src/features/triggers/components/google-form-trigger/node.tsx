import { BaseTriggerNode } from "@/components/react-flow/base-trigger-node";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { GoogleFormTriggerDialog} from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken} from "../google-form-trigger/action";
import { GOOGLE_FORM_TRIGGER_CHANNEL } from "@/inngest/channels/google-form-trigger";


export const GoogleFormTrigger= memo((props: NodeProps) =>{

    const [dialogOpen , setDialogOpen] =useState(false )
const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : GOOGLE_FORM_TRIGGER_CHANNEL,
        topic : "status",
        refreshToken : fetchGoogleFormTriggerRealtimeToken,})

    const handleOpenSettings =() => setDialogOpen(true) ;
    return (
        <>
        <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode 
        {...props}
        icon="/googleform.svg"
        name="When form will be submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        
        
        />

        </>
    )
})