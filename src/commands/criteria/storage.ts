import { LocalStorage } from "@raycast/api";
import { UUID } from "#src/types";
import { StoryCriteria } from "#src/commands/criteria/model";

export async function saveCriteria(criteria: StoryCriteria) {
  console.log("Saving criteria", criteria);
  await LocalStorage.setItem(
    `criteria.${criteria.id}`,
    JSON.stringify(criteria),
  );
}

export async function loadCriteria(
  id: UUID,
): Promise<StoryCriteria | undefined> {
  const c = await LocalStorage.getItem<string>(`criteria.${id}`);
  if (!c) {
    return;
  }
  return StoryCriteria.fromJSON(c);
}

export async function loadAllCriteria(): Promise<StoryCriteria[]> {
  const allItems = await LocalStorage.allItems<string[]>();
  const allSerializedCriteria = Object.entries(allItems)
    .filter(([key]) => key.startsWith("criteria."))
    .map(([_, value]) => value);
  return allSerializedCriteria.map((c) => {
    console.log("Loading criteria", c);
    return StoryCriteria.fromJSON(c);
  });
}
