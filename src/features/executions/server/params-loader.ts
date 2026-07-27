import { workflowsParams } from "@/features/workflows/params";
import { createLoader } from "nuqs/server";
import { executionsParams } from "../params";



export const executionsParamsLoader = createLoader(executionsParams)