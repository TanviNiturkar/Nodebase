
import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
//import { AVAILABLE_MODELS } from "./dialog";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini";
import { generateText } from "ai";
import {createAnthropic} from "@ai-sdk/anthropic" ;
import { OPENAI_CHANNEL } from "@/inngest/channels/openAi";
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";


Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context , null , 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});
type AnthropicData ={
    variableName? : string;
    credentialId? : string ;
    systemPrompt? : string;
    userPrompt? : string;
}; 
export const anthropicExecutor : NodeExecutor<AnthropicData> = async({
    data,
    context,
    step,
    userId,
    nodeId,
    publish
})=> {

    await publish(AnthropicChannel, "status", {
    nodeId,
    status: "loading",
});

   
    if(!data.variableName) {
        await publish(AnthropicChannel, "status", {
            nodeId,
            status: "error",
        }) ;
        throw new NonRetriableError("Anthropic node : Variable name is required to store AI response");
    }
     if(!data.credentialId){
             await publish(AnthropicChannel, "status", {
                nodeId,
                status: "error",
            }) ;
            throw new NonRetriableError("Anthropic node : Credential is required to store AI response");
      
        }

    if(!data.userPrompt){
        await publish(AnthropicChannel, "status", {
            nodeId,
            status: "error",
        }) ;
        throw new NonRetriableError("Anthropic node : User prompt is required to generate AI response");
    }

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

const systemPrompt = data.systemPrompt
? Handlebars.compile(data.systemPrompt)(context)
: "You are a helpful assistant." ;

const userPrompt = data.userPrompt
? Handlebars.compile(data.userPrompt)(context)
: "Provide a response to the user's query." ;


const credential = await step.run("get-credential",()=>{
    return prisma.credential.findUnique({
        where : {
            id: data.credentialId ,
            userId,
        }
    })
})

    if(!credential){
        throw new NonRetriableError("Gemini Node : Credential not found")
    }



const Anthropic = createAnthropic({
    apiKey: decrypt(credential.value),
})


    try{
        const {steps} = await step.ai.wrap(
            "anthropic-generate-text",
            generateText, {
                model : Anthropic("claude-3-opus-20241201"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "" ;

        await publish(AnthropicChannel, "status", {
            nodeId,
            status: "success",
        }) ;

        return {
            ...context,
            [data.variableName]: {
                aiResponse : text ,
            }
        }

    } catch(error){
        await publish(AnthropicChannel, "status", {
            nodeId,
            status: "error",
        }) ;
        throw error ;
    }


}