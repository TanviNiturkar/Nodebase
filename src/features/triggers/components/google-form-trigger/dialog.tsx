"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { generateCategoricalChart } from "recharts/types/chart/generateCategoricalChart";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";


 

interface Props {
    open : boolean ;
    onOpenChange : (open : boolean)=> void 
}

export const GoogleFormTriggerDialog = ({
    open , onOpenChange 
} : Props) =>{
    const params = useParams() ;
    const workflowId = params.workflowId as string ;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" ;
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}` ;

    const copyToClipboard = async() => {
        try {            await navigator.clipboard.writeText(webhookUrl) ;
           toast.success("Webhook URL copied to clipboard")
        } catch (error) {
            console.error("Failed to copy webhook URL:", error) ;
            toast.error("Failed to copy webhook URL. Please try copying manually.")
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's Apps Script to trigger this workflow when a form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex-gap-2">
                            <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                            <Button type="button" onClick={copyToClipboard} size="icon" variant="outline">
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                   <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium text-sm">Setup instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Open your Google Form.</li>
                        <li>Click on the three dots in the top-right corner, then select "Script editor".</li>
                        <li>Copy and paste the script below.</li>
                        <li>Replace <code>WEBHOOK_URL</code> in the script with the webhook URL provided above.</li>
                        <li>Save and click "Triggers" &gt; Add Trigger.</li>
                        <li>Choose : From form &gt; On form submit &gt; save</li>
                        
                    </ol>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Script:</h4>
                        <Button type="button" variant="outline" onClick={async()=>{
                            const script = generateGoogleFormScript(webhookUrl);
                            try {
                                await navigator.clipboard.writeText(script) ;
                                toast.success("Google Apps Script copied to clipboard")
                            } catch (error) {
                                console.error("Failed to copy Google Apps Script:", error) ;
                                toast.error("Failed to copy Google Apps Script. Please try copying manually.") 
                            }
                        }}>
                            <CopyIcon className="size-4 mr-2"  />
                            Copy Google App Script
                        </Button>
                        <p className="text-xs text-muted-foreground">This script includes your webhook URL and handles form submissions.</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">{"{{googleForm.respondentEmail}}"}</code> - Respondent's email 
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">{"{{googleForm.responses['Question Title']}}"}</code> - Specific answer 
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">{"{{googleForm.responses}}"}</code> - All responses as a JSON object
                            </li>
                        </ul>
                    </div>
                   </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}