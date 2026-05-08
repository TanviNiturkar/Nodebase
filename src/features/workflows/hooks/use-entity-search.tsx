import { PAGINATION } from "@/config/constants";
import React, { use, useEffect } from "react";


interface useEntitySearchProps<T extends {
    search: string;
    page: number;
}> {
    params: T;
    setParams: (params:T)=>void ;
    debounceMs?: number;
}

export function useEntitySearch<T extends {
    search: string;
    page: number;
}>({ params, setParams, debounceMs = 500 }: useEntitySearchProps<T>) {
    const [ localSearch, setLocalSearch] = React.useState(params.search);
    useEffect(() => {
        if(localSearch === "" && params.search !== "")
        {
            setParams({...params, search: PAGINATION.DEFAULT_PAGE,});
            return;
        }

        const timer = setTimeout(() => {
            if(localSearch !== params.search)            {
                setParams({...params, search: localSearch, page: PAGINATION.DEFAULT_PAGE,});
            }
        }, debounceMs);
        return () => clearTimeout(timer);

    },[localSearch, setParams, params, debounceMs])


    useEffect(() => {
        setLocalSearch(params.search);
    }, [params.search]);

    return {
        search: localSearch,
        onSearchChange: setLocalSearch
    }
}