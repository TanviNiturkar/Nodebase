import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useExecutionsParams } from "./use-executions-params";
import { CredentialType } from "@/generated/prisma";


export const useSuspenseExecutions = () => {
    const trpc = useTRPC();
    const [params] = useExecutionsParams();
    return useSuspenseQuery(trpc.execution.getMany.queryOptions(params));

}




export const useSuspenseExecution = (id:string)=>{
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.execution.getOne.queryOptions({id}))
}



