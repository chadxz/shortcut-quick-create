import {
  Action,
  ActionPanel,
  Color,
  Icon,
  List,
  LocalStorage,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import CriteriaForm from "#src/commands/criteria/form";
import { loadAllCriteria } from "#src/commands/criteria/storage";
import { StoryCriteria } from "#src/commands/criteria/model";

export default function Command() {
  const { push } = useNavigation();

  const [criteria, setCriteria] = useState<StoryCriteria[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const criteria = await loadAllCriteria();
      setCriteria(criteria);
      setLoading(false);
    })();
  }, []);

  return (
    <List
      searchBarPlaceholder={"Filter criteria sets"}
      actions={
        <ActionPanel>
          <Action
            title="Create New Criteria"
            onAction={() => push(<CriteriaForm />)}
          />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      {criteria.length === 0 ? (
        <List.EmptyView
          title="You have no criteria sets. Create one to get started."
          icon={{ source: Icon.Stars, tintColor: Color.Blue }}
        />
      ) : (
        criteria.map((c) => (
          <List.Item
            key={c.id}
            title={c.name}
            actions={
              <ActionPanel>
                <Action
                  title="Edit Criteria"
                  onAction={() => push(<CriteriaForm criteria={c} />)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
