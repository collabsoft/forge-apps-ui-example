import { view, requestJira } from "@forge/bridge";
import { issueAdjustments } from "@forge/jira-bridge/out/issue-adjustments";
import { getFieldsSnapshot } from "./getFieldsSnapshot";

const log = console.log;
console.log = (...args) => {
  log('UI modifications app,', ...args);
};

// Context usage
view.getContext().then((context) => {
  const  { extension } = context;
  console.log('Context:');
  console.table({project: extension.project, issueType: extension.issueType})

  console.log('UI modifications data:');
  console.table(extension.uiModifications);
})

const { onInit } = issueAdjustments;

const onInitCallback = ({ api }) => {
  const { getFieldById } = api;

  // Hiding the priority field
  const priority = getFieldById('priority');
  priority?.setVisible(false);

  // Changing the summary field label
  const summary = getFieldById('summary');
  summary?.setName('Modified summary label');

  // Changing the assignee field description
  const assignee = getFieldById('assignee');
  assignee?.setDescription('Description added by UI modifications');

  // Hiding the description field
  const description = getFieldById('description');
  description?.setVisible(false);

  console.log('Fields Snapshot:');
  console.table(getFieldsSnapshot(getFieldById));

    // Return a Promise to apply changes after resolve.
    return new Promise(async (resolve) => {
      // Example Product API call
      const result = await requestJira('/rest/api/3/myself');
      console.log('API call status:', result.status);
      resolve();
    });
};

onInit(onInitCallback);
