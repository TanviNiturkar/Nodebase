"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query";
import { error } from "console";
import { toast } from "sonner";


const Page =() =>{
     const trpc = useTRPC();
     const testAI = useMutation(trpc.testAi.mutationOptions({
        onSuccess: ()=> {
            toast.success("AI job queued successfully!")
        },
        onError: ({message}) => {
            toast.error("Failed to queue AI job: " + message)
        }
     }))
     return (
        <Button onClick={() => testAI.mutate()}>Click to test subscription</Button>
     )
}

export default Page;