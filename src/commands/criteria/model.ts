import { HexadecimalColor, ISO8601Timestamp, UUID } from "#src/types";
import { z } from "zod";
import { StoryCriteriaFormFields } from "#src/commands/criteria/form/model";

interface StoryCustomField {
  name: string;
  value: string;
}

interface StoryLabel {
  name: string; // length: 128
  color: HexadecimalColor;
  description: string;
}

interface WorkflowState {
  id: number;
  workflowId: number;
}

type StoryType = "bug" | "feature" | "story";

const StoryCriteriaSchema = z
  .object({
    customFields: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    deadline: z.string().datetime().optional(),
    description: z.string().optional(),
    epicId: z.number().gt(0).optional(),
    estimate: z.number().gt(0).optional(),
    followers: z.array(z.string().uuid()).optional(),
    id: z.string().uuid(),
    iterationId: z.number().gt(0).optional(),
    labels: z
      .array(
        z.object({
          name: z.string(),
          color: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    name: z.string(),
    ownerIds: z.array(z.string().uuid()).optional(),
    requestedById: z.string().uuid().optional(),
    teamId: z.string().uuid().optional(),
    type: z
      .union([z.literal("bug"), z.literal("feature"), z.literal("story")])
      .optional(),
    workflowState: z
      .object({
        id: z.number().gt(0),
        workflowId: z.number().gt(0),
      })
      .optional(),
  })
  .required({ id: true, name: true });

export type StoryCriteriaFields = z.input<typeof StoryCriteriaSchema>;

export class StoryCriteria {
  readonly customFields?: StoryCustomField[];
  readonly deadline?: ISO8601Timestamp;
  readonly description?: string; // length: 100,000
  readonly epicId?: number;
  readonly estimate?: number;
  readonly followers?: UUID[];
  readonly id: UUID;
  readonly iterationId?: number;
  readonly labels?: StoryLabel[];
  readonly name: string;
  readonly ownerIds?: UUID[];
  readonly requestedById?: UUID;
  readonly teamId?: UUID;
  readonly type?: StoryType;
  readonly workflowState?: WorkflowState;

  constructor(fields: StoryCriteriaFields) {
    this.id = fields.id;
    this.name = fields.name;
    Object.assign(this, fields);
  }

  static fromForm(form: StoryCriteriaFormFields): StoryCriteria {
    return new StoryCriteria({
      customFields: parseCustomFields(form.customFields),
      deadline: form.deadline,
      description: form.description,
      epicId: parseNumber(form.epicId),
      estimate: parseNumber(form.estimate),
      followers: form.followers,
      id: form.id,
      iterationId: parseNumber(form.iterationId),
      labels: parseLabels(form.labels),
      name: form.name,
      ownerIds: form.ownerIds,
      requestedById: form.requestedById,
      teamId: form.teamId,
      type: parseStoryType(form.type),
      workflowState: parseWorkflowState(form.workflowId, form.workflowStateId),
    });
  }

  static fromJSON(json: string): StoryCriteria {
    const parsed = StoryCriteriaSchema.safeParse(JSON.parse(json));
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    return new StoryCriteria(parsed.data);
  }
}

function parseNumber(maybeNumber: string | undefined): number | undefined {
  return maybeNumber ? parseInt(maybeNumber, 10) : undefined;
}

function parseCustomFields(
  maybeCustomFields: string[] | undefined,
): StoryCustomField[] | undefined {
  if (!maybeCustomFields) {
    return;
  }

  return maybeCustomFields.map((field) => {
    const [name, value] = field.split(":");
    return { name, value };
  });
}

function parseLabels(
  maybeLabels: string[] | undefined,
): StoryLabel[] | undefined {
  if (!maybeLabels) {
    return;
  }

  return maybeLabels.map((label) => {
    const [name, color, description] = label.split(":");
    return { name, color, description };
  });
}

function parseStoryType(maybeType: string | undefined): StoryType | undefined {
  if (!maybeType) {
    return;
  }

  switch (maybeType) {
    case "bug":
      return "bug";
    case "feature":
      return "feature";
    default:
      return "story";
  }
}

function parseWorkflowState(
  workflowId: string | undefined,
  workflowStateId: string | undefined,
): WorkflowState | undefined {
  if (!workflowId || !workflowStateId) {
    return;
  }

  return {
    id: parseInt(workflowStateId, 10),
    workflowId: parseInt(workflowId, 10),
  };
}
