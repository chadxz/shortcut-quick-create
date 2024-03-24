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

class StoryCriteria {
  customFields?: StoryCustomField[];
  deadline?: ISO8601Timestamp;
  description?: string; // length: 100,000
  epicId?: number;
  estimate?: number;
  followers?: UUID[];
  id: UUID;
  iterationId?: number;
  labels?: StoryLabel[];
  ownerIds?: UUID[];
  requestedById?: UUID;
  teamId?: UUID;
  type?: StoryType;
  workflowState?: WorkflowState;

  constructor(id: UUID) {
    this.id = id;
  }
}
