import { prefetch, trpc } from "@/trpc/server";
import type { inferInput    } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.credential.getMany>;

export const prefetchCredentialss = async(params: Input) => {
        return prefetch(trpc.credential.getMany.queryOptions(params))
}



export const prefetchCredential = (id:string)=>{
        return prefetch(trpc.credential.getOne.queryOptions({id}));
}