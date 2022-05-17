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

const deleteUiModification = function (uiModificationId, setDeleteResult) {
    return invokeUiModifications('DELETE /rest/api/3/uiModifications/{uiModificationId}', {
        id: uiModificationId,
    }).then((data) => {
        setDeleteResult(JSON.stringify(data, null, 2));
    });
};

export default function useDeleteUimConfirmation(
    currentUiModification,
    setDeleteUimResult,
    setUpdateTable,
) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const [isDeleteConfirmationOpen, setDeleteConfirmationIsOpen] = useState(false);

    const openDeleteConfirmation = useCallback(() => setDeleteConfirmationIsOpen(true), []);

    const closeDeleteConfirmation = useCallback(() => {
        setDeleteConfirmationIsOpen(false);
        setUpdateTable((state) => {
            return state + 1;
        });
    }, []);

    return [
        <ModalTransition>
            {isDeleteConfirmationOpen && (
                <Modal
                    width={'small'}
                    onClose={() => {
                        setSubmitDisabled(false);
                        closeDeleteConfirmation();
                    }}
                >
                    <ModalHeader>
                        <ModalTitle appearance="danger">Delete UI modification?</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            UI modification {currentUiModification?.name} (
                            {currentUiModification?.id})
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => {
                                setSubmitDisabled(false);
                                closeDeleteConfirmation();
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
                                deleteUiModification(
                                    currentUiModification.id,
                                    setDeleteUimResult,
                                ).then(() => {
                                    setSubmitDisabled(false);
                                    closeDeleteConfirmation();
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
        openDeleteConfirmation,
    ];
}
