
import { inngest } from "@/inngest/client";
import { sendWorkflowExecutionEvent } from "@/inngest/utils";
//import { inngest } from "@/inngest/channels/google-form-trigger";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        console.log("===== GOOGLE FORM WEBHOOK HIT =====");
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        console.log("Workflow:", workflowId);

        if(!workflowId){
            return NextResponse.json(
                {success : false , error : "Missing required query parameter : workflowId" },
                {status : 400},
            )
        }
        const body = await request.json();
        const formData = {
            formId : body.formId,
            responses : body.responses,
            formTitle : body.formTitle,
            responseId : body.responseId,
            timestamp : body.timestamp,
            respondentEmail : body.respondentEmail,
            raw : body,
        }
        console.log("Sending event to Inngest...", formData);
        await sendWorkflowExecutionEvent({
            workflowId,
            initialData : {
                googleForm : formData,
            }
        })
        console.log("Event sent successfully.");
         return NextResponse.json({success : true},
        {status : 200}
        )
    }

    catch(error){

        console.error("Google form webhook error: " ,error);
        return NextResponse.json(
            {success : false , error : "Failed to process the Google Form submission" },
            {status : 500},
        )
    }
}