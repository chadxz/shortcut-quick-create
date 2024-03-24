import { Action, ActionPanel, Color, Icon, List, useNavigation } from "@raycast/api";
import CriteriaForm from "./criteria-form";
import { useState } from "react";

export default function Command() {
  const { push } = useNavigation();

  const [criteria, setCriteria] = useState<StoryCriteria>();

  return (
    <List
      searchBarPlaceholder={"Filter criteria sets"}
      actions={
        <ActionPanel>
          <Action title="Create New Criteria" onAction={() => push(<CriteriaForm />)} />
        </ActionPanel>
      }
    >
      <List.EmptyView
        title="You have no criteria sets. Create one to get started."
        icon={{ source: Icon.Stars, tintColor: Color.Blue }}
      />
    </List>
  );
}
