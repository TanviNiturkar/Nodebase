import { Inngest, realtime, staticSchema } from "inngest";



export const DISCORD_CHANNEL = "discord-execution" ;
// 1. Client setup is simpler
export const inngest = new Inngest({ id: "nodebase" });

// 2. Define the channel using the new object syntax
export const DiscordChannel = realtime.channel({
    name: DISCORD_CHANNEL,
    topics: {
        status: {
            schema: staticSchema<{
                nodeId: string;
                status: "loading" | "success" | "error";
            }>(),
        },
    },
});
