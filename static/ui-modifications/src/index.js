import { view, requestJira } from '@forge/bridge';
import { uiModifications } from '@forge/jira-bridge/out/ui-modifications'
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

    console.log('UI modifications data:');
    console.table(extension.uiModifications);
});

const { onInit, onChange } = uiModifications;

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

onInit(onInitCallback, () => {
    return ["summary", "assignee", "description", "priority"];
});

const onChangeCallback = ({ api, change }) => {
    // The `change.current` property provides access
    // to the field which triggered the change
    const id = change.current.getId();

    // Checking if the change event was triggered by the `summary` field
    if (id === 'summary') {
        // Logging the current `summary` field value
        const value = change.current.getValue();
        console.log(`The ${id} field value is: ${value}`);

        // Updating the `summary` field description
        change.current.setDescription(
            `The ${id} field was updated at: ${new Date().toString()}`
        );

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

onChange(onChangeCallback, () => ["summary", "priority"]);
