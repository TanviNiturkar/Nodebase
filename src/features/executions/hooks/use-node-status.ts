// import { Realtime } from "inngest";
// import { useEffect, useState } from "react";
// import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
// import { useInngestSubscription } from "inngest/realtime"; 

// interface UseNodeStatusOptions {
//     nodeId : string;
//     channel : string;
//     topic : string;
//     refreshToken: ()=> Promise<any> ;
// }

// export function useNodeStatus({nodeId, channel, topic, refreshToken} : UseNodeStatusOptions) {
//     const [status, setStatus] = useState<NodeStatus>("initial");
//     const { data} = useInngestSubscription<any>({
//         refreshToken, enabled:true ,
//     })


//     useEffect(()=>{
//         if(!data.length){
//             return ;
//         }

//         const latestMessage = data.filter((message)=>message.kind==="data" && message.channel === channel && message.topic === topic && message.data.nodeId === nodeId)
//         .sort((a,b) => {
//             if(a.kind ==="data" && b.kind === "data"){
//                 return (
//                     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//                 )
//             }
//             return 0 ;
//         })[0];


//         if(latestMessage?.kind === "data"){
//             setStatus(latestMessage.data.status as NodeStatus) ;
//         }
//     },[data, nodeId, channel, topic])
// return status ;
// }


import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useRealtime as useInngestSubscription } from "inngest/react"; 

interface UseNodeStatusOptions {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<any>;
}

export function useNodeStatus({ nodeId, channel, topic, refreshToken }: UseNodeStatusOptions) {
    const [status, setStatus] = useState<NodeStatus>("initial");
    
    // Pass <any> here to stop the 'data' is 'any' errors temporarily
    const {messages : {all :data} } = useInngestSubscription<any>({
        token : refreshToken,
    }as any);

    useEffect(() => {
        if (!data || !data.length ) return;

        const latestMessage = data
            .filter((m: any) => 
                m.channel === channel && 
                m.topic === topic && 
                m.data?.nodeId === nodeId
            )
            .sort((a: any, b: any) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

        if (latestMessage?.data?.status) {
            setStatus(latestMessage.data.status as NodeStatus);
        }
    }, [data, nodeId, channel, topic]);

    return status;
}
