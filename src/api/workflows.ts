import { useFetch } from "@raycast/utils";

export default function useWorkflows(apiToken: string) {
  return useFetch<Workflow[]>("https://api.app.shortcut.com/api/v3/workflows", {
    headers: { "Shortcut-Token": apiToken },
  });
}

interface Workflow {
  name: string;
  id: number;
  default_state_id: number;
  states: WorkflowState[];
}

interface WorkflowState {
  name: string;
  type: string;
  id: number;
  position: 0;
}
