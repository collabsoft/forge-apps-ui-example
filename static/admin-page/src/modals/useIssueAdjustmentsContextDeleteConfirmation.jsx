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

const deleteIssueAdjustmentsContext = function (
  issueAdjustment,
  contextId,
  setIssueAdjustmentsContextDeleteResult
) {
  return invokeIssueAdjustments(
    "PUT /rest/api/3/issueAdjustments/{issueAdjustmentId}",
    {
      id: issueAdjustment.id,
      body: {
        contexts: [
          ...issueAdjustment.contexts
            .filter((context) => context.id !== contextId)
            .map((context) => ({
              projectId: context.projectId,
              issueTypeId: context.issueTypeId,
              viewType: "GIC",
            })),
        ],
      },
    }
  ).then(data => {
    if ("data" in data && data.data !== "") {
      data.data = JSON.parse(data.data);
    };
    setIssueAdjustmentsContextDeleteResult(JSON.stringify(data, null, 2));
  });
};

export default function useIssueAdjustmentsContextDeleteConfirmation(
  currentIssueAdjustment,
  currentContext,
  setIssueAdjustmentsContextDeleteResult,
  setUpdateTable
) {
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

  const [isContextDeleteConfirmationOpen, setContextDeleteConfirmationIsOpen] =
    useState(false);

  const openContextDeleteConfirmation = useCallback(
    () => setContextDeleteConfirmationIsOpen(true),
    []
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
          width={"small"}
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
              For issue adjustment {currentIssueAdjustment?.name} (
              {currentIssueAdjustment?.id}) and context id
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
                deleteIssueAdjustmentsContext(
                  currentIssueAdjustment,
                  currentContext.id,
                  setIssueAdjustmentsContextDeleteResult
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
