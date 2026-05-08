import { workflowsParams } from "@/features/workflows/params";
import { createLoader } from "nuqs";
import { executionsParams } from "../params";



export const executionsParamsLoader = createLoader(executionsParams)