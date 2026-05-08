import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";


export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams();
    return useSuspenseQuery(trpc.credential.getMany.queryOptions(params));

}


export const useCreateCredential = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation(trpc.credential.create.mutationOptions({
        onSuccess: (data)=> {
            toast.success(`Credential "${data.name}" created successfully!`);
           
            queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}));}
      ,
    onError : (error) =>{
        toast.error(`Failed to create credential: ${error.message}`);
    }
    
}));
}

export const useRemoveCredential = ()=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credential.remove.mutationOptions({
            onSuccess:(data)=> {
                toast.success(`Credential "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.credential.getOne.queryFilter({id:data.id}));
            }
        })
    )
}


export const useSuspenseCredential = (id:string)=>{
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credential.getOne.queryOptions({id}))
}



export const useUpdateCredential = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation(trpc.credential.update.mutationOptions({
        onSuccess: (data)=> {
            toast.success(`Credential "${data.name}" saved successfully!`);
           
            queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}) );
            queryClient.invalidateQueries(trpc.credential.getOne.queryOptions({id:data.id})
        );
        }


      ,
    onError : (error) =>{
        toast.error(`Failed to save workflow: ${error.message}`);
    }
    
}));
}



export const useCredentialByType = (type : CredentialType)=>{
    const trpc = useTRPC();
    return useQuery(trpc.credential.getByType.queryOptions({type}))

}