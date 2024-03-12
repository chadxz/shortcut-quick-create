import { ActionPanel, Action, showToast, Icon, List, Color, Toast, getPreferenceValues, showHUD } from "@raycast/api";
import { useState } from "react";
import ky from "ky";
import "isomorphic-fetch";

type Maybe<T> = T | null | undefined;

interface Preferences {
  apiToken: string;
}

async function addToShortcut(title: Maybe<string>) {
  if (!title) {
    return showToast({ title: "Error", message: "Please enter text", style: Toast.Style.Failure });
  }

  const { apiToken } = getPreferenceValues<Preferences>();

  const res = await ky.post("https://api.app.shortcut.com/api/v3/stories", {
    json: {
      name: title,
      description: "",
      custom_fields: [{
        field_id: "6495ab7d-ac45-4c04-a8e4-b20ab20f4562",
        value_id: "65ef6425-6435-4810-a3d4-dc6bc03fc317"
      }],
      group_id: "6495ab7d-4515-467e-8edc-4b53898f13ac",
      workflow_state_id: 500000006
    },
    headers: new Headers({ "Shortcut-Token": apiToken })
  });

  console.log(res.json());
  return showHUD("Item successfully created", { clearRootSearch: true });
}

export default function Command() {
  const [searchText, setSearchText] = useState<string>();

  return (
    <List searchBarPlaceholder={"Add a new item"} filtering={false} actions={
      <ActionPanel>
        <Action title="Add to Shortcut" onAction={() => addToShortcut(searchText)} />
      </ActionPanel>
    } onSearchTextChange={setSearchText}>
      <List.EmptyView title="Quickly add a new item in Shortcut." icon={{ source: Icon.Plus, tintColor: Color.Blue }} />
    </List>
  );
}
