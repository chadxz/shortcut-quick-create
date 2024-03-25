import { LocalStorage } from "@raycast/api";
import { UUID } from "#src/types";
import { StoryCriteria } from "#src/commands/criteria/model";

export async function saveCriteria(id: UUID, criteria: StoryCriteria) {
  await LocalStorage.setItem(`criteria.${id}`, JSON.stringify(criteria));
}

export async function loadCriteria(id: UUID): Promise<StoryCriteria | undefined> {
  const c = await LocalStorage.getItem<string>(`criteria.${id}`);
  if (!c) {
    return;
  }
  return JSON.parse(c) as StoryCriteria;
}

export async function loadAllCriteria(): Promise<StoryCriteria[]> {
  const allItems = await LocalStorage.allItems<string[]>();
  const allSerializedCriteria = Object.entries(allItems).filter(([key]) => key.startsWith("criteria.")).map(([_, value]) => value);
  return allSerializedCriteria.map((c) => JSON.parse(c) as StoryCriteria);
}
