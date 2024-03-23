import { UUID } from "../types";
import { LocalStorage } from "@raycast/api";
/*
interface StoryCustomFieldCriteria {
  name: string;
  value: string;
}

interface StoryLabelCriteria {
  name: string; // length: 128
  color: HexadecimalColor;
  description: string;
}

type StoryTypeCriteria = "bug" | "feature" | "story";

interface StoryCriteria {
  customFields: StoryCustomFieldCriteria[];
  deadline: ISO8601Timestamp;
  description: string; // length: 100,000
  epicId: number;
  estimate: number;
  followers: UUID[];
  id: UUID;
  iterationId: number;
  labels: StoryLabelCriteria[];
  ownerIds: UUID[];
  requestedById: UUID;
  teamId: UUID;
  type: StoryTypeCriteria;
  workflowId: number;
  workflowStateId: number;
}
*/

export async function saveCriteria(id: UUID, criteria: string) {
  await LocalStorage.setItem(`criteria.${id}`, criteria);
}

export async function loadCriteria(id: UUID): Promise<string | undefined> {
  return await LocalStorage.getItem(`criteria.${id}`);
}

export async function loadAllCriteria(): Promise<string[]> {
  const allItems = await LocalStorage.allItems();
  return Object.keys(allItems).filter((key) => key.startsWith("criteria."));
}
