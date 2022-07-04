import { view, requestJira } from '@forge/bridge';
import { uiModificationsApi } from '@forge/jira-bridge';
import { getFieldsSnapshot } from './getFieldsSnapshot';

const log = console.log;
console.log = (...args) => {
    log('UI modifications app,', ...args);
};

// Context usage
view.getContext().then((context) => {
    const { extension } = context;
    console.log('Context:');
    console.table({ project: extension.project, issueType: extension.issueType });
});

const { onInit, onChange } = uiModificationsApi;

const onInitCallback = ({ api, uiModifications }) => {
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

    // Here we read the data that can be set when creating the UI modifications context
    // This is preferred method of making small customizations to adapt your UI modifications to different projects and issue types
    uiModifications.forEach((uiModification) => {
        console.log(`Data for UI modification ID ${uiModification.id}`, uiModification.data);
    });

    // Return a Promise to apply changes after resolve.
    return new Promise(async (resolve) => {
        // Example Product API call
        const result = await requestJira('/rest/api/3/myself');
        console.log('API call status:', result.status);
        resolve();
    });
};

onInit(onInitCallback, () => {
    return ['summary', 'assignee', 'description', 'priority'];
});

const onChangeCallback = ({ api, change, uiModifications }) => {
    // The `change.current` property provides access
    // to the field which triggered the change
    const id = change.current.getId();

    // The UI modifications data is also present in the onChange callback
    uiModifications.forEach((uiModification) => {
        console.log(`Data for UI modification ID ${uiModification.id}`, uiModification.data);
    });

    // Checking if the change event was triggered by the `summary` field
    if (id === 'summary') {
        // Logging the current `summary` field value
        const value = change.current.getValue();
        console.log(`The ${id} field value is: ${value}`);

        // Updating the `summary` field description
        change.current.setDescription(`The ${id} field was updated at: ${new Date().toString()}`);

        // Showing the priority field (keep in mind the onInitCallback hides it)
        api.getFieldById('priority')?.setVisible(true);

        // Delaying changes application
        const delay = 3000;
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Changes applied after ${delay}ms delay`);
                resolve();
            }, delay);
        });
    }
};

onChange(onChangeCallback, () => ['summary', 'priority']);
