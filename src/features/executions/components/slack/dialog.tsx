"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField ,Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import z from "zod";


// export const AVAILABLE_MODELS = [
//     "gemini-1.5-pro" ,
//     "gemini-1.5-flash" ,
//     "gemini-1.5-flash-8b" ,
//     "gemini-1.0-pro" ,
//     "gemini-pro"

// ] as const ;

const formschema = z.object({
    variableName : z
    .string()
    .min(1 , {message : "Variable name is required"})
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/ , {message : "Invalid variable name. Use letters, numbers, underscores, and dollar signs. Cannot start with a number."}),
   // model: z.enum(AVAILABLE_MODELS), // z.string().min(1 , {message : "Model selection is required"}) ,
   
   content: z.string()
   .min(1,"Message content is required"),
   //.max(2000,"Discord messages cannot exceed 2000 characters."),
   webhookUrl: z.string().min(1,"Webhook Url is required")
});



export type SlackFormValues = z.infer<typeof formschema>

interface Props {
    open : boolean ;
    onOpenChange : (open : boolean)=> void 
    onSubmit : (values : z.infer<typeof formschema>)=> void;
    defaultValues? : Partial<SlackFormValues>;
}

export const SlackDialog = ({
    open , onOpenChange , onSubmit , defaultValues={}
} : Props) =>{
      const form  = useForm<z.infer<typeof formschema>>({
        resolver : zodResolver(formschema) ,
        defaultValues : {
           // username: defaultValues.username || "" ,
            variableName : defaultValues?.variableName || "" ,

          //  model : defaultValues?.model || AVAILABLE_MODELS[0] ,
            content : defaultValues?.content || "",
            webhookUrl : defaultValues?.webhookUrl || ""
        }
    })

    useEffect(()=>{
        if(open){
            form.reset({
         //    username: defaultValues.username || "" ,
            variableName : defaultValues?.variableName || "" ,
          //  model : defaultValues?.model || AVAILABLE_MODELS[0] ,
            content : defaultValues?.content || "",
            webhookUrl : defaultValues?.webhookUrl || ""
            })
        }
    },[open , defaultValues , form])



    const watchVariableName = form.watch("variableName") || "mySlack"
    // const watchMethod = form.watch("method")
    // const showBodyfield = ["POST" , "PUT" , "PATCH"].includes(watchMethod) ;
    const handleSubmit = (values : z.infer<typeof formschema>) =>{
        onSubmit(values) ;
        onOpenChange(false) ;
    }
   
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack</DialogTitle>
                    <DialogDescription>
                        Configure settings for the Slack node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                      
                       <FormField control={form.control}
                       name="variableName"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Variable Name</FormLabel>
                            <FormControl>
                            <Input placeholder="mySlack" {...field}/>
                            </FormControl>
                          
                            <FormDescription>
                              Use this name to reference the result in other nodes:{" "} 
                              {`{{${watchVariableName}.aiResponseaaa.text}}`}  </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>
                      <FormField  control={form.control} name="webhookUrl" render={({field})=>(
                        
                                               <FormItem> <FormLabel>Webhook URL</FormLabel>
                    
                                              <FormControl>
                                                <Input placeholder="https://hooks.slack/services/..." {...field}/>
                                              </FormControl>
                                              <FormDescription>
                                              Get this from Slack : Channel Settings &get; Workflows &gt; Webhooks   </FormDescription>
                                              <FormDescription>
                                                Make sure the "key" is "Content".
                                              </FormDescription>
                                                <FormMessage />
                                                </FormItem>
                                                )}/>
                    
                      
        

                            <FormField control={form.control}
                       name="content"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Message Content</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Summary: {{mySlack.text}}" {...field}  className="min-h-[120px] font-mono text-sm" />
                            </FormControl>
                          
                            <FormDescription>
                               The message to send. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringigy objects   </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>


                      
                          <DialogFooter className="mt-4">
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}