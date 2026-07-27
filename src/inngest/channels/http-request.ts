import {channel , topic} from "@inngest/realtime" ;





// 2. Define the channel using the new object syntax
export const httpRequestChannel = channel("http-request-execution")
    
    .addTopic(topic("status").type<{ nodeId: string; status: "loading" | "success" | "error" }>()

     
);
