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
   username: z.string().optional(),
   content: z.string()
   .min(1,"Message content is required")
   .max(2000,"Discord messages cannot exceed 2000 characters."),
   webhookUrl: z.string().min(1,"Webhook Url is required")
});



export type DiscordFormValues = z.infer<typeof formschema>

interface Props {
    open : boolean ;
    onOpenChange : (open : boolean)=> void 
    onSubmit : (values : z.infer<typeof formschema>)=> void;
    defaultValues? : Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
    open , onOpenChange , onSubmit , defaultValues={}
} : Props) =>{
      const form  = useForm<z.infer<typeof formschema>>({
        resolver : zodResolver(formschema) ,
        defaultValues : {
            username: defaultValues.username || "" ,
            variableName : defaultValues?.variableName || "" ,

          //  model : defaultValues?.model || AVAILABLE_MODELS[0] ,
            content : defaultValues?.content || "",
            webhookUrl : defaultValues?.webhookUrl || ""
        }
    })

    useEffect(()=>{
        if(open){
            form.reset({
             username: defaultValues.username || "" ,
            variableName : defaultValues?.variableName || "" ,
          //  model : defaultValues?.model || AVAILABLE_MODELS[0] ,
            content : defaultValues?.content || "",
            webhookUrl : defaultValues?.webhookUrl || ""
            })
        }
    },[open , defaultValues , form])



    const watchVariableName = form.watch("variableName") || "myDiscord"
    // const watchMethod = form.watch("method")
    // const showBodyfield = ["POST" , "PUT" , "PATCH"].includes(watchMethod) ;
    const handleSubmit = (values : z.infer<typeof formschema>) =>{
        onSubmit(values) ;
        onOpenChange(false) ;
    }
   
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Discord</DialogTitle>
                    <DialogDescription>
                        Configure settings for the Discord node.
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
                            <Input placeholder="myDiscord" {...field}/>
                            </FormControl>
                          
                            <FormDescription>
                              Use this name to reference the result in other nodes:{" "} 
                              {`{{${watchVariableName}.aiResponse.text}}`}  </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>
                      <FormField  control={form.control} name="webhookUrl" render={({field})=>(
                        
                                               <FormItem> <FormLabel>Webhook URL</FormLabel>
                    
                                              <FormControl>
                                                <Input placeholder="https://discord.com/api/webhooks/..." {...field}/>
                                              </FormControl>
                                              <FormDescription>
                                                Get this from Discord : Channel Settings &gt; Integrations &gt; Webhooks
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
                            <Textarea placeholder="Summary: {{myDiscord.text}}" {...field}  className="min-h-[120px] font-mono text-sm" />
                            </FormControl>
                          
                            <FormDescription>
                               The message to send. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects   </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>
                    

                      <FormField  control={form.control} name="username" render={({field})=>(
                        
                                               <FormItem> <FormLabel>Bot Username (optional)</FormLabel>
                    
                                              <FormControl>
                                                <Input placeholder="Workflow Bot" {...field}/>
                                              </FormControl>
                                              <FormDescription>
                                                 Override the webhook's  default username </FormDescription>
                                                <FormMessage />
                                                </FormItem>
                                                )}/>
                    
                            {/* <FormField control={form.control}
                       name="model"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Model</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                  
                                  {AVAILABLE_MODELS.map((model)=>(
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                  ))}
                                     </SelectContent>

                            </Select>
                          
                            <FormDescription>
                                The Gemini model to use for the request.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/> */}



                      
                          <DialogFooter className="mt-4">
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}