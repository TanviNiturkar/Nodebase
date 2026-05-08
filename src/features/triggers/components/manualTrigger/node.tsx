import { BaseTriggerNode } from "@/components/react-flow/base-trigger-node";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL } from "@/inngest/channels/manual-request";
import { fetchManualTriggerRealtimeToken } from "./action";



export const ManualTriggerNode = memo((props: NodeProps) =>{

    const [dialogOpen , setDialogOpen] =useState(false )
const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : MANUAL_TRIGGER_CHANNEL,
        topic : "status",
        refreshToken : fetchManualTriggerRealtimeToken,})
    const handleOpenSettings =() => setDialogOpen(true) ;
    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode 
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        description="When manually triggered"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        
        
        />

        </>
    )
})