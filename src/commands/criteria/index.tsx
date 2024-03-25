import { Action, ActionPanel, Color, Icon, List, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import CriteriaForm from "#src/commands/criteria/form";
import { loadAllCriteria } from "#src/commands/criteria/storage";
import { StoryCriteria } from "#src/commands/criteria/model";

export default function Command() {
  const { push } = useNavigation();

  const [criteria, setCriteria] = useState<StoryCriteria[]>();

  useEffect(() => {
    void (async () => {
      const criteria = await loadAllCriteria();
      setCriteria(criteria);
    })();
  }, []);

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
