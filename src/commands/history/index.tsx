import {
  ActionPanel,
  Action,
  showToast,
  Icon,
  List,
  Toast,
  getPreferenceValues,
  showHUD,
  open,
} from "@raycast/api";
import { MyPreferences } from "#src/preferences";
import useSearch from "#src/api/search";

async function openInShortcut(url: string) {
  if (url === "") {
    return showToast({
      title: "Error",
      message: "Choose an item to open",
      style: Toast.Style.Failure,
    });
  }

  await open(url);
  return showHUD("Opening in Shortcut", { clearRootSearch: true });
}

function OpenInShortcutAction({ url }: { url: string }) {
  return (
    <Action
      title={"Open in Shortcut"}
      icon={Icon.Link}
      onAction={() => openInShortcut(url)}
    />
  );
}

export default function Command() {
  const { apiToken } = getPreferenceValues<MyPreferences>();

  const { isLoading, data: stories } = useSearch(
    { query: "technical-area:triage" },
    apiToken,
  );

  return (
    <>
      <List
        searchBarPlaceholder={"Filter stories"}
        actions={
          <ActionPanel>
            <Action
              title="Open in Shortcut"
              onAction={() => console.log("Open in Shortcut")}
            />
          </ActionPanel>
        }
        isLoading={isLoading}
      >
        <List.Section
          title="History"
          subtitle="Stories matching your quick create criteria"
        >
          {stories?.map((story) => (
            <List.Item
              title={story.name}
              key={story.id}
              actions={
                <ActionPanel>
                  <OpenInShortcutAction url={story.app_url} />
                </ActionPanel>
              }
            ></List.Item>
          ))}
        </List.Section>
      </List>
    </>
  );
}
