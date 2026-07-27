
import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options} from "ky";

import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { th } from "date-fns/locale";


Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context , null , 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});
type HttpRequestData ={
    variableName? : string;
    endpoint?: string;
    method? : "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body? : string;
}; 
export const httpRequestExecutor : NodeExecutor<HttpRequestData> = async({
    data,
    context,
    step,
    nodeId,
    publish ,
})=> {

    await publish(httpRequestChannel().status({
        nodeId,
        status: "loading",
    })) ;

   



    try{
    const result = await step.run("http-request", async()=>{
            if(!data.endpoint ) {
        throw new NonRetriableError("Endpoint and method are required for HTTP request node");
    }
    
    if(!data.method) {
        throw new NonRetriableError("HTTP method is required for HTTP request node");
    }
        if(!data.variableName) {
           await publish(httpRequestChannel().status({
        nodeId,
        status: "error",
    })) ;

        throw new NonRetriableError("Variable name is required to store HTTP response");
    }

        const endpoint = Handlebars.compile(data.endpoint)(context);
        
        const method = data.method ;

        const options : Options ={method} ;

        if(["POST","PUT","PATCH"].includes(method)){

            const resolved = Handlebars.compile(data.body || "")(context) ;
            JSON.parse(resolved) // validate JSON body at runtime and throw error if invalid
            
                options.body = resolved
                options.headers = {
                    "Content-Type" : "application/json",
                }
            
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType && contentType.includes("application/json") ? await response.json() : await response.text();


        const responsePayload = {
              httpResponse : {
                status : response.status,
                statusText : response.statusText,
                data : responseData,
        }
    }

        
    
        return {
            ...context,
            [data.variableName] : responsePayload,
        }
    


    })

        await publish(httpRequestChannel().status({
        nodeId,
        status: "success",
    }) ) ;
        return result;
}
catch(error){
     await publish(httpRequestChannel().status({
        nodeId,
        status: "error",
    }) ) ;
    throw error ;
}

}