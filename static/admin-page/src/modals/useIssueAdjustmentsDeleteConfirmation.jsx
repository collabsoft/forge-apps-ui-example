import { useCallback, useState } from "react";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { invokeIssueAdjustments } from "../invokeIssueAdjustments";

import Button from "@atlaskit/button/standard-button";

const deleteIssueAdjustments = function (
  issueAdjustmentId,
  setIssueAdjustmentsDeleteResult
) {
  return invokeIssueAdjustments(
    "DELETE /rest/api/3/issueAdjustments/{issueAdjustmentId}",
    {
      id: issueAdjustmentId,
    }
  ).then(data => {
    setIssueAdjustmentsDeleteResult(JSON.stringify(data, null, 2));
  });
};

export default function useIssueAdjustmentsDeleteConfirmation(
  currentIssueAdjustment,
  setIssueAdjustmentsDeleteResult,
  setUpdateTable
) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationIsOpen] =
    useState(false);

  const openDeleteConfirmation = useCallback(
    () => setDeleteConfirmationIsOpen(true),
    []
  );

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
          width={"small"}
          onClose={() => {
            setSubmitDisabled(false);
            closeDeleteConfirmation();
          }}
        >
          <ModalHeader>
            <ModalTitle appearance="danger">
              Delete issue adjustment?
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              Issue adjustment {currentIssueAdjustment?.name} (
              {currentIssueAdjustment?.id})
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
                deleteIssueAdjustments(
                  currentIssueAdjustment.id,
                  setIssueAdjustmentsDeleteResult
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
