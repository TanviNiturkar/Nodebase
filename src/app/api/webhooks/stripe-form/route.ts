
import { inngest } from "@/inngest/client";
import { sendWorkflowExecutionEvent } from "@/inngest/utils";
import { time } from "console";
//import { inngest } from "@/inngest/channels/google-form-trigger";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        if(!workflowId){
            return NextResponse.json(
                {success : false , error : "Missing required query parameter : workflowId" },
                {status : 400},
            )
        }
        const body = await request.json();
        const formData = {
           eventId : body.id ,
              eventType : body.type,
            timestamp : body.created,
            livemode : body.livemode,
            data : body.data?.object ,
        }
        
        await sendWorkflowExecutionEvent({
            workflowId,
            initialData : {
                stripe : formData,
            }
        })
        return NextResponse.json({success : true},
        {status : 200}
        )
    }

    catch(error){

        console.error("Stripe webhook error: " ,error);
        return NextResponse.json(
            {success : false , error : "Failed to process the Stripe event" },
            {status : 500},
        )
    }
}