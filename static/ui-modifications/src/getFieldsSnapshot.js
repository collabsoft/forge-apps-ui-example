const SUPPORTED_FIELDS = ['assignee', 'description', 'labels', 'priority', 'summary'];

function getFieldData(getFieldById, name) {
    return {
        received: !!getFieldById(name),
        name: getFieldById(name)?.getName(),
        value: getFieldById(name)?.getValue(),
        description: getFieldById(name)?.getDescription(),
        isVisible: getFieldById(name)?.isVisible(),
    };
}

export function getFieldsSnapshot(getFieldById) {
    return SUPPORTED_FIELDS.reduce((acc, fieldId) => {
        acc[fieldId] = getFieldData(getFieldById, fieldId);

        return acc;
    }, {});
}
