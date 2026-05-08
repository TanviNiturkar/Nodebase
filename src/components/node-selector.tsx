"use client"

import { NodeType } from "@/generated/prisma"
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator"; // Fixed: usually from ./ui/separator, not resizable-panels
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2"

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        description: "Runs the flow on clicking a button. Good for getting started quickly.",
        icon: MousePointerIcon,
    },
     {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form Trigger",
        description: "Runs the flow when a Google Form is submitted.",
        icon: "/googleform.svg",
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "Stripe Trigger",
        description: "Runs the flow when a Stripe event occurs.",
        icon: "/stripe.svg",
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Runs the flow when a Gemini event occurs.",
        icon: "/gemini.svg",
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAI",
        description: "Runs the flow when an OpenAI event occurs.",
        icon: "/openai.svg",
    },
    {
        type: NodeType.ANTHROPIC,
        label: "Anthropic",
        description: "Runs the flow when an Anthropic event occurs.",
        icon: "/anthropic.svg",
    },
    {
        type: NodeType.DISCORD,
        label: "Discord",
        description: "Runs the flow when an Discord event occurs.",
        icon: "/discord.svg",
    },
    {
        type: NodeType.SLACK,
        label: "Slack",
        description: "Runs the flow when an Slack event occurs.",
        icon: "/slack.svg",
    }
];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP Request",
        icon: GlobeIcon,
    },
]

interface NodeSelectorProps {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({
    open, onOpenChange, children
}: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((nodeType: NodeTypeOption) => {
        // Fixed: Use 'nodeType' instead of 'Selection'
        if (nodeType.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            );

            if (hasManualTrigger) {
                toast.error("Only one manual trigger is allowed per workflow.");
                return; // Added return to prevent node creation
            }
        }

        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL,
            )

            const centerx = window.innerWidth / 2;
            const centery = window.innerHeight / 2;
            const flowPosition = screenToFlowPosition({
                x: centerx + (Math.random() - 0.5) * 200,
                y: centery + (Math.random() - 0.5) * 200,
            })

            const newNode = {
                id: createId(),
                data: { type: nodeType.type, label: nodeType.label },
                position: flowPosition,
                type: nodeType.type, // Fixed: Use 'nodeType' instead of 'Selection'
            }

            if (hasInitialTrigger) {
                return [newNode];
            }

            return [...nodes, newNode]
        })

        onOpenChange(false);
    }, [setNodes, getNodes, onOpenChange, screenToFlowPosition]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-1 py-4">
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary hover:bg-muted/50"
                                onClick={() => handleNodeSelect(nodeType)}>
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-sm font-medium">{nodeType.label}</span>
                                        <span className="text-muted-foreground text-xs">{nodeType.description}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator />
                <div className="flex flex-col gap-1 py-4">
                    <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Steps</p>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary hover:bg-muted/50"
                                onClick={() => handleNodeSelect(nodeType)}>
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-sm font-medium">{nodeType.label}</span>
                                        <span className="text-muted-foreground text-xs">{nodeType.description}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}
