import { Inngest, realtime, staticSchema } from "inngest";



export const HTTP_REQUEST_CHANNEL = "http-request-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const httpRequestChannel = realtime.channel({
    name: HTTP_REQUEST_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
