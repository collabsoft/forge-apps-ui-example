import { useCallback, useState } from 'react';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import { invokeUiModifications } from '../invokeUiModifications';

import Button from '@atlaskit/button/standard-button';

const deleteContext = function (uiModification, contextId, setContextDeleteResult) {
    return invokeUiModifications('PUT /rest/api/3/uiModifications/{uiModificationId}', {
        id: uiModification.id,
        body: {
            contexts: [
                ...uiModification.contexts
                    .filter((context) => context.id !== contextId)
                    .map((context) => ({
                        projectId: context.projectId,
                        issueTypeId: context.issueTypeId,
                        viewType: 'GIC',
                    })),
            ],
        },
    }).then((data) => {
        if ('data' in data && data.data !== '') {
            data.data = JSON.parse(data.data);
        }

        setContextDeleteResult(JSON.stringify(data, null, 2));
    });
};

export function useContextDeleteConfirmation(
    currentUiModification,
    currentContext,
    setContextDeleteResult,
    setUpdateTable,
) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const [isContextDeleteConfirmationOpen, setContextDeleteConfirmationIsOpen] = useState(false);

    const openContextDeleteConfirmation = useCallback(
        () => setContextDeleteConfirmationIsOpen(true),
        [],
    );

    const closeContextDeleteConfirmation = useCallback(() => {
        setContextDeleteConfirmationIsOpen(false);
        setUpdateTable((state) => {
            return state + 1;
        });
    }, []);

    return [
        <ModalTransition>
            {isContextDeleteConfirmationOpen && (
                <Modal
                    width={'small'}
                    onClose={() => {
                        setSubmitDisabled(false);
                        closeContextDeleteConfirmation();
                    }}
                >
                    <ModalHeader>
                        <ModalTitle appearance="danger">Delete context?</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            For UI modifications {currentUiModification?.name} (
                            {currentUiModification?.id}) and context id
                            {currentContext?.id}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => {
                                setSubmitDisabled(false);
                                closeContextDeleteConfirmation();
                            }}
                            appearance="subtle"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={isSubmitDisabled}
                            onClick={() => {
                                setSubmitDisabled(true);
                                deleteContext(
                                    currentUiModification,
                                    currentContext.id,
                                    setContextDeleteResult,
                                ).then(() => {
                                    setSubmitDisabled(false);
                                    closeContextDeleteConfirmation();
                                });
                            }}
                            appearance="danger"
                            autoFocus
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </ModalTransition>,
        openContextDeleteConfirmation,
    ];
}
