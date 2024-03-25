import {
  Action,
  ActionPanel,
  Form,
  getPreferenceValues,
  Icon,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { useEffect, useMemo, useState } from "react";
import useWorkflows from "#src/api/workflows";
import { MyPreferences } from "#src/preferences";
import { omit, sortBy } from "lodash";
import { loadCriteria, saveCriteria } from "../storage";
import { randomUUID } from "node:crypto";
import { oneLine } from "common-tags";

const ADD_CRITERIA_FIELD = "Add Criteria Field";

const ALL_CRITERIA_FIELDS = [
  "customFields",
  "deadline",
  "description",
  "epicId",
  "estimate",
  "followers",
  "iterationId",
  "labels",
  "ownerIds",
  "requestedById",
  "teamId",
  "type",
  "workflowStateId",
];

export default function CriteriaForm({ id }: { id?: string }) {
  const { pop } = useNavigation();
  const [initialValues, setInitialValues] = useState<StoryCriteriaForm>();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      if (!id) {
        return;
      }

      const criteria = await loadCriteria(id);
      if (!criteria) {
        return;
      }

      const criteriaFormValues = JSON.parse(criteria) as StoryCriteriaForm;
      setInitialValues(criteriaFormValues);
      setSelectedFields(Object.keys(omit(criteriaFormValues, "name")));
    })();
  }, [id, setInitialValues]);

  const { handleSubmit, itemProps, values } = useForm<StoryCriteriaForm>({
    async onSubmit(criteria: StoryCriteriaForm) {
      console.log(omit(criteria, ADD_CRITERIA_FIELD));
      await saveCriteria(id ?? randomUUID(), JSON.stringify(criteria));
      await showToast({
        title: "Success!",
        message: "Your criteria has been saved.",
        style: Toast.Style.Success,
      });
      pop();
    },
    initialValues,
    validation: {
      name: FormValidation.Required,
    },
  });

  const addCriteriaFieldSelect = (value: string) => {
    if (value === ADD_CRITERIA_FIELD) {
      return;
    }

    setSelectedFields([value, ...selectedFields]);
  };

  const { apiToken } = getPreferenceValues<MyPreferences>();

  const { data: workflows } = useWorkflows(apiToken);

  const workflowStates = useMemo(() => {
    const states = workflows?.find(
      (w) => `${w.id}` === values.workflowId,
    )?.states;
    return sortBy(states, "position");
  }, [values, workflows]);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={id ? "Update Criteria" : "Create Criteria"}
            icon={Icon.Stars}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        title={"Name"}
        placeholder={"A name for this Criteria"}
        {...itemProps["name"]}
      />
      <Form.Separator />
      <Form.Description
        text={oneLine`
          Criteria are used to pre-populate fields in Shortcut stories 
          that are created using the Quick Create action. Select a field
          from the dropdown below to add it to your Criteria.
        `}
      />
      <Form.Dropdown id={ADD_CRITERIA_FIELD} onChange={addCriteriaFieldSelect}>
        <Form.Dropdown.Item
          key={ADD_CRITERIA_FIELD}
          value={ADD_CRITERIA_FIELD}
          title={ADD_CRITERIA_FIELD}
          icon={Icon.Plus}
        />
        {ALL_CRITERIA_FIELDS.filter((f) => !selectedFields.includes(f)).map(
          (f) => (
            <Form.Dropdown.Item title={f} value={f} key={f} />
          ),
        )}
      </Form.Dropdown>
      {selectedFields.flatMap((c) => {
        switch (c) {
          case "description":
            return (
              <Form.TextArea
                key={"description"}
                title={"Description"}
                {...itemProps["description"]}
              />
            );
          case "teamId":
            return (
              <Form.Dropdown
                key={"teamId"}
                title={"Team"}
                {...itemProps["teamId"]}
              ></Form.Dropdown>
            );
          case "workflowStateId":
            return [
              <Form.Dropdown
                key={"workflowId"}
                title={"Workflow"}
                {...itemProps["workflowId"]}
              >
                {workflows?.map((w) => {
                  return (
                    <Form.Dropdown.Item
                      title={w.name}
                      value={`${w.id}`}
                      key={w.name}
                    />
                  );
                })}
              </Form.Dropdown>,
              <Form.Dropdown
                key={"workflowStateId"}
                title={"Workflow State"}
                {...itemProps["workflowStateId"]}
              >
                {workflowStates?.map((s) => (
                  <Form.Dropdown.Item
                    title={s.name}
                    value={`${s.id}`}
                    key={s.id}
                  />
                ))}
              </Form.Dropdown>,
            ];
        }
      })}
    </Form>
  );
}
