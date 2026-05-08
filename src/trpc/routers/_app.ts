

import { CredentialsRouter } from '@/features/credentials/server/routers';
import { createTRPCRouter } from '../init';

import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';



export const appRouter = createTRPCRouter({

workflows : workflowsRouter ,

//   testAi : premiumProcedure.mutation(async ()=>{
   
//    await inngest.send({
//     name:"execute/ai", 
//     }  )
// return {success: true, message: "Job queued"}
//   }),
//   getWorkflows: protectedProcedure.query(({ctx}) => {
    
//       return prisma.workflow.findMany();
//     }),
//     createWorkflow: protectedProcedure.mutation(async()=> {
//       await inngest.send({
//         name: "app/task.created",
//         data: {
//           email : "tanvipniturkar98.com"
//         }
//       })
//       return {success: true, message: "Job queued"}
//     })

credential : CredentialsRouter,
execution : executionsRouter
});
// export type definition of API


export type AppRouter = typeof appRouter;