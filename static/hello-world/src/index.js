import { issueAdjustments } from '@forge/jira-bridge';
import { requestJira } from '@forge/bridge';

const { onInit } = issueAdjustments;
const log = console.log;
console.log = (...args) => {
  log('Issue Adjustment:', ...args);
};

onInit(({ api }) => {
  const { getFieldById } = api;

  console.log('Hello World from Issue Adjustment');

  // Hiding the priority field
  const priority = getFieldById('priority');
  priority?.setVisible(false);

  // Changing the summary field label
  const summary = getFieldById('summary');
  summary?.setName('Adjusted summary label');

  // Changing the assignee field description 
  const assignee = getFieldById('assignee');
  assignee?.setDescription('Description added by issue adjustments');

  // Return a Promise to apply changes after resolve.
  return new Promise(async (resolve) => {
    // Example Product API call
    const result = await requestJira('/rest/api/3/myself');
    console.log('API call status:', result.status);
    resolve();
  });
});
