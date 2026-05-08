"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField ,Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import z from "zod";


const formschema = z.object({
    variableName : z
    .string()
    .min(1 , {message : "Variable name is required"})
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/ , {message : "Invalid variable name. Use letters, numbers, underscores, and dollar signs. Cannot start with a number."}),
    endpoint: z.url({message:"Please enter a valid URL"}),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional()
});



export type HttpRequestFormValues = z.infer<typeof formschema>

interface Props {
    open : boolean ;
    onOpenChange : (open : boolean)=> void 
    onSubmit : (values : z.infer<typeof formschema>)=> void;
    defaultValues? : Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
    open , onOpenChange , onSubmit , defaultValues={}
} : Props) =>{

    const form  = useForm<z.infer<typeof formschema>>({
        resolver : zodResolver(formschema) ,
        defaultValues : {
            variableName : defaultValues?.variableName || "" ,
            endpoint : defaultValues?.endpoint || "" ,
            method : defaultValues?.method || "GET",
            body : defaultValues?.body || ""
        }
    })

    useEffect(()=>{
        if(open){
            form.reset({
                variableName : defaultValues?.variableName || "" ,
                endpoint : defaultValues?.endpoint || "" ,
                method : defaultValues?.method || "GET",
                body : defaultValues?.body || ""
            })
        }
    },[open , defaultValues , form])



    const watchVariableName = form.watch("variableName") || "myApiCall"
    const watchMethod = form.watch("method")
    const showBodyfield = ["POST" , "PUT" , "PATCH"].includes(watchMethod) ;
    const handleSubmit = (values : z.infer<typeof formschema>) =>{
        onSubmit(values) ;
        onOpenChange(false) ;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP request node.
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
                            <Input placeholder="myApiCall" {...field}/>
                            </FormControl>
                          
                            <FormDescription>
                              Use this name to reference the result in other nodes:{" "} 
                              {`{{${watchVariableName}.httpResponse.data}}`}  </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>

                      
                       <FormField control={form.control}
                       name="method"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Method</FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a method"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </FormControl>

                            </Select>
                            <FormDescription>The HTTP method to use for the request.</FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>

                       <FormField control={form.control}
                       name="endpoint"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Endpoint URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://api.example.com/users/{{httpResponse.data.id}}" {...field}/>
                            </FormControl>
                          
                            <FormDescription>
                                Static URL or use {"{{variables}}" } for simple values or {"{{json variables}}"} to stringify objects
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>

                          {showBodyfield && (
                            <FormField control={form.control}
                       name="body"
                       render={({field})=>(
                        <FormItem>
                            <FormLabel>Request Body</FormLabel>
                            <FormControl>
                            <Textarea placeholder="https://api.example.com/users/{{httpResponse.data.id}}" {...field}  className="min-h-[120px] font-mono text-sm" />
                            </FormControl>
                          
                            <FormDescription>
                                Static URL or use {"{{variables}}" } for simple values or {"{{json variables}}"} to stringify objects
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}/>

                          )}
                          <DialogFooter className="mt-4">
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}