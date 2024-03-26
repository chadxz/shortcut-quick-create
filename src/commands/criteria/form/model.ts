import { z } from "zod";

export const StoryCriteriaFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  customFields: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  epicId: z.string().optional(),
  estimate: z.string().optional(),
  followers: z.array(z.string()).optional(),
  iterationId: z.string().optional(),
  labels: z.array(z.string()).optional(),
  ownerIds: z.array(z.string()).optional(),
  requestedById: z.string().optional(),
  teamId: z.string().optional(),
  type: z.string().optional(),
  workflowId: z.string().optional(),
  workflowStateId: z.string().optional(),
});

export type StoryCriteriaFormFields = z.input<typeof StoryCriteriaFormSchema>;
