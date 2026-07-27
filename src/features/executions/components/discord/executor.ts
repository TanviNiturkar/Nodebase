
import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options} from "ky";
import {decode} from "html-entities"
import Handlebars from "handlebars";
import { DiscordChannel } from "@/inngest/channels/discord";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context , null , 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});
type DiscordData ={
    variableName? : string;
   webhookUrl? : string 
   content? : string 
   username? : string 
}; 
export const discordExecutor : NodeExecutor<DiscordData> = async({
    data,
    context,
    step,
    userId,
    nodeId,
    publish
})=> {

    await publish(DiscordChannel().status({
        nodeId,
        status: "loading",
    })) ;


 
//     try{
//     const result = await step.run("http-request", async()=>{
//             if(!data.endpoint ) {
//         throw new NonRetriableError("Endpoint and method are required for HTTP request node");
//     }
    
//     if(!data.method) {
//         throw new NonRetriableError("HTTP method is required for HTTP request node");
//     }
//         if(!data.variableName) {
//             await publish
//             (httpRequestChannel, "status", {
//                 nodeId,
//                 status: "error",
//             }) ;
//         throw new NonRetriableError("Variable name is required to store HTTP response");
//     }

//         const endpoint = Handlebars.compile(data.endpoint)(context);
        
//         const method = data.method ;

//         const options : Options ={method} ;

//         if(["POST","PUT","PATCH"].includes(method)){

//             const resolved = Handlebars.compile(data.body || "")(context) ;
//             JSON.parse(resolved) // validate JSON body at runtime and throw error if invalid
            
//                 options.body = resolved
//                 options.headers = {
//                     "Content-Type" : "application/json",
//                 }
            
//         }

//         const response = await ky(endpoint, options);
//         const contentType = response.headers.get("content-type");
//         const responseData = contentType && contentType.includes("application/json") ? await response.json() : await response.text();


//         const responsePayload = {
//               httpResponse : {
//                 status : response.status,
//                 statusText : response.statusText,
//                 data : responseData,
//         }
//     }

        
    
//         return {
//             ...context,
//             [data.variableName] : responsePayload,
//         }
    


//     })

//         await publish(httpRequestChannel, "status", {
//         nodeId,
//         status: "success",
//     }) ;
//         return result;
// }
// catch(error){
//      await publish(httpRequestChannel, "status", {
//         nodeId,
//         status: "error",
//     }) ;
//     throw error ;
// }

const rawContent = Handlebars.compile(data.content)(context);
const content = decode(rawContent)
    const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined ;



    try{
       
        const result = await step.run("discord-webhook",async() =>{
              
    if(!data.variableName) {
        await publish(DiscordChannel().status({
            nodeId,
            status: "error",
        })) ;
        throw new NonRetriableError("Discord node : Variable name is required to store AI response");
    }

    if(!data.webhookUrl){
         await publish(DiscordChannel().status({
            nodeId,
            status: "error",
        })) ;
        throw new NonRetriableError("Discord node : webhook URL is required to store AI response");
  
    }

    if(!data.content){
        await publish(DiscordChannel().status({
            nodeId,
            status: "error",
        })) ;
        throw new NonRetriableError("Discord node : Message content is required to generate AI response");
    }

            await ky.post(data.webhookUrl!  ,{
                json: {
                    content:content.slice(0,2000)
                }
            })
            return {
                ...context,
                [data.variableName]: {
                    messageContent : content.slice(0,2000)
                }
            }
        })
        await publish(DiscordChannel().status({
            nodeId,
            status: "success",
        })) ;

    return result ;

    } catch(error){
        await publish(DiscordChannel().status({
            nodeId,
            status: "error",
        })) ;
        throw error ;
    }


}