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
import { useMemo, useState } from "react";
import useWorkflows from "#src/api/workflows";
import { MyPreferences } from "#src/preferences";
import { omit, omitBy, sortBy, isUndefined } from "lodash";
import { saveCriteria } from "#src/commands/criteria/storage";
import { randomUUID } from "node:crypto";
import { oneLine } from "common-tags";
import {
  StoryCriteriaFormFields,
  StoryCriteriaFormSchema,
} from "#src/commands/criteria/form/model";
import { StoryCriteria } from "#src/commands/criteria/model";

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

function buildDefaultValues(): StoryCriteriaFormFields {
  return {
    id: randomUUID(),
    name: "",
  };
}

export default function CriteriaForm({
  criteria,
}: {
  criteria?: StoryCriteria;
}) {
  const { pop } = useNavigation();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const initialValues = useMemo(() => {
    if (!criteria) {
      return buildDefaultValues();
    }

    const values = StoryCriteriaFormSchema.parse(criteria);

    setSelectedFields(
      Object.keys(omitBy(omit(values, ["id", "name"]), isUndefined)),
    );

    return values;
  }, [criteria]);

  console.log("initialValues", initialValues);
  const { handleSubmit, itemProps, values } = useForm<StoryCriteriaFormFields>({
    async onSubmit(fields: StoryCriteriaFormFields) {
      await saveCriteria(
        StoryCriteria.fromForm({
          ...fields,
          id: criteria?.id ?? randomUUID(),
        }),
      );
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
            title={criteria ? "Update Criteria" : "Create Criteria"}
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
