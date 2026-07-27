
import { Realtime , topic ,channel} from "@inngest/realtime" ;

export const DISCORD_CHANNEL = "discord-execution" ;

// 2. Define the channel using the new object syntax
export const DiscordChannel = channel(DISCORD_CHANNEL)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>(),
    )
