import { InitialNode } from "@/components/initial-node";
import { anthropicExecutor } from "@/features/executions/components/anthropic/executor";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manualTrigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma";
import { type NodeTypes } from "@xyflow/react";


export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.MANUAL_TRIGGER] :ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER] : GoogleFormTrigger,
    [NodeType.STRIPE_TRIGGER] : StripeTriggerNode, // Placeholder, replace with actual StripeTrigger component when implemented
    [NodeType.OPENAI] : OpenAiNode, // Placeholder, replace with actual OpenAiNode component when implemented
    [NodeType.ANTHROPIC] :AnthropicNode,
    [NodeType.DISCORD]  : DiscordNode,
    [NodeType.SLACK] : SlackNode ,

} as const satisfies NodeTypes; // Correct spelling: satisfies



export type RegisteredNodeType = keyof typeof nodeComponents;