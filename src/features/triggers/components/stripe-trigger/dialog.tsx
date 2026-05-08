"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { generateCategoricalChart } from "recharts/types/chart/generateCategoricalChart";
import { toast } from "sonner";



 

interface Props {
    open : boolean ;
    onOpenChange : (open : boolean)=> void 
}

export const StripeTriggerDialog = ({
    open , onOpenChange 
} : Props) =>{
    const params = useParams() ;
    const workflowId = params.workflowId as string ;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" ;
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}` ;

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Stripe webhook settings to trigger this workflow when a Stripe event occurs.
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
                        <li>Open your Stripe dashboard.</li>
                        <li>Navigate to "Settings" &gt; "Webhooks".</li>
                        <li>Click "Add Endpoint".</li>
                        <li>Enter the webhook URL provided above.</li>
                        <li>Select the events you want to trigger this workflow.</li>
                        <li>Save and copy the signing secret.</li>
                    </ol>
                   
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.amount}}"}</code> - Payment amount </li>
                            <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.currency}}"}</code> - Currency </li>
                            <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.customerId}}"}</code> - Customer ID </li>
                            <li><code className="bg-background px-1 py-0.5 rounded">{"{{json stripe}}"}</code> - Full event data as JSON </li>
                            <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.eventType}}"}</code> - Type of the Stripe event (e.g. payment_intent.succeeded) </li>
                        </ul>
                    </div>
                   </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}