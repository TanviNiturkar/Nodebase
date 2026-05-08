
"use client";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-views";
import {  useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useUpgradeModel } from "../hooks/use-upgrade-model";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import { router } from "better-auth/api";
import {Workflow , Credential as DbCredential, CredentialType }  from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";


export const CredentialsSearch = () => {

    const [params, setParams] = useCredentialsParams();
    const {search, onSearchChange} = useEntitySearch({params, setParams});

    return (
        <EntitySearch value={search} onChange={onSearchChange} placeholder="Search Credentials..." />
    )
}


export const CredentialsList = () => {

    const credentials = useSuspenseCredentials();
    return (
        <EntityList
         items={credentials.data.items} 
         getKey={(credential)=> credential.id} 
         renderItem={(credential)=> 
         <CredentialItem data={credential}/>
        } 
        emptyView={<CredentialsEmpty  />} />
    )
}

export const CredentialsHeader = ({disabled}: {disabled?: boolean}) => {
    
    return (
        
       <EntityHeader 
       title="Credentials"  
       description="Create and manage your Credentials" 
       newButtonHref="/credentials/new"
       newButtonLabel="New Credentials" 
       disabled={disabled} 
      />
        
    )
}

export const CredentialsPagination = () => {
const credentials = useSuspenseCredentials();
const [params, setParams] = useCredentialsParams();
    return (
<EntityPagination disabled={credentials.isFetching} totalPages={credentials.data.totalPages} page={credentials.data.page} onPageChange={(page)=>setParams({...params,page})}/>
    )
}




export const CredentialsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer header={<CredentialsHeader />} search={<CredentialsSearch />} pagination={<CredentialsPagination />}>
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading Credentials..." />
}

export const CredentialsError = () => {
    return <ErrorView message="Error loading Credentials..." />
}

export const CredentialsEmpty = () => {
    const router = useRouter();
    const handleCreate = ()=>{
          router.push(`/Credentials/new`);
           
    }
    return (
       
        <EmptyView message="You haven't created any Credentials yet. Get started by creating your first credential."/>

    )
}


const credentialLogos : Record<CredentialType,string> = {
    [CredentialType.OPENAI] : "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GEMINI] : "/gemini.svg",
}

export const CredentialItem = ({data}:{data:DbCredential})=>{
    const  removeCredential = useRemoveCredential();
    const handleRemove =()=>{
        removeCredential.mutate({id:data.id})
    }
    const logo = credentialLogos[data.type] || "/openai.svg"
    return (
        <EntityItem 
        href={`/Credentials/${data.id}`}  
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "} 
            &bull; Created{" "} 
            {formatDistanceToNow(data.createdAt,{addSuffix: true})} </>
        } 
        image={
            <div className="size-8 flex items-center justify-center">
                <Image src={logo} alt={data.type} width={20} height={20}/>
            </div>
            
        } 
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}  />
    )
}