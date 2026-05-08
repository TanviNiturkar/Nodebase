import { CredentialsList,CredentialsContainer, CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredential, prefetchCredentialss } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs";
import { Suspense } from "react";


type Props ={
    searchParams : Promise<SearchParams>
}
const Page =async ({searchParams}:Props) => {
await requireAuth();

const params = await credentialsParamsLoader(searchParams)
prefetchCredentialss(params);
        return (
            <CredentialsContainer>
            <HydrateClient>
                 <ErrorBoundary fallback={<CredentialsError />}>
                    <Suspense fallback={<CredentialsLoading />}>
                        <CredentialsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
            </CredentialsContainer>
           
        )
}
export default Page;