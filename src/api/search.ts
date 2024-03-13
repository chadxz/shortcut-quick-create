import { useFetch } from "@raycast/utils";
import { ISO8601Timestamp, UUID } from "../types";

export default function useSearch(params: SearchParameters, apiToken: string) {
  const p = buildQueryParams(params);
  return useFetch(`https://api.app.shortcut.com/api/v3/search?${p}`, {
    headers: { "Shortcut-Token": apiToken },
    mapResult: (res: SearchResult) => {
      return { data: res.stories.data };
    },
  });
}

function buildQueryParams(params: SearchParameters): string {
  const urlSearchParams = new URLSearchParams();

  if (params.detail) {
    urlSearchParams.append("detail", params.detail);
  }

  if (params.page_size && params.page_size > 0) {
    urlSearchParams.append("page_size", params.page_size.toString());
  }

  if (params.query) {
    urlSearchParams.append("query", params.query);
  }

  return urlSearchParams.toString();
}

interface SearchParameters {
  detail?: string;
  page_size?: number;
  query?: string;
}

interface Story {
  id: number;
  name: string;
  app_url: string;
  created_at: ISO8601Timestamp;
  requested_by_id: UUID;
}

interface SearchResult {
  stories: {
    data: Story[];
  };
}
