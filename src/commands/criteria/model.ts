import { HexadecimalColor, ISO8601Timestamp, UUID } from "../../types";

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

  constructor(id: UUID) {
    this.id = id;
  }

  static fromForm(form: StoryCriteriaForm) {

  }

  toForm(): StoryCriteriaForm {
    return {
      name: this.name,
      // customFields: this.customFields,
      // deadline: this.deadline,
      description: this.description,
      // epicId: this.epicId,
      // estimate: this.estimate,
      // followers: this.followers,
      // iterationId: this.iterationId,
      // labels: this.labels,
      // ownerIds: this.ownerIds,
      // requestedById: this.requestedById,
      // teamId: this.teamId,
      // type: this.type,
      workflowId: this.workflowState?.workflowId?.toString() ?? "",
      workflowStateId: this.workflowState?.id?.toString() ?? "",
    };
  }
}
