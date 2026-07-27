import { Realtime , topic ,channel} from "@inngest/realtime" ;


export const OPENAI_CHANNEL = "openai-execution" ;

// 2. Define the channel using the new object syntax
export const openAiChannel = channel(OPENAI_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
                status: "loading" | "success" | "error";
            }>() 
        ) 
  
