import Button from "@atlaskit/button/standard-button";
import { CodeBlock } from "@atlaskit/code";
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";
import Flag, { FlagGroup } from "@atlaskit/flag";
import MoreIcon from "@atlaskit/icon/glyph/more";
import { invoke } from "@forge/bridge";

import TableTree, {
  Cell,
  Header,
  Headers,
  Row,
  Rows,
} from "@atlaskit/table-tree";
import React, { useEffect, useState } from "react";
import { invokeIssueAdjustments } from "../invokeIssueAdjustments";
import useIssueAdjustmentsContextCreateModal from "../modals/useIssueAdjustmentsContextCreateModal";
import useIssueAdjustmentsContextDeleteConfirmation from "../modals/useIssueAdjustmentsContextDeleteConfirmation";
import useIssueAdjustmentsDeleteConfirmation from "../modals/useIssueAdjustmentsDeleteConfirmation";

function getProjectDetails(projectData, id) {
  const project = projectData?.data?.values.find(
    (project) => project.id === id
  );
  return project ? (
    <span
      style={{
        paddingLeft: "24px",
        backgroundImage: `url(${project.avatarUrls["16x16"]})`,
        backgroundSize: "16px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {project.name} ({project.key})
    </span>
  ) : (
    `Deleted ${id}`
  );
}
function getIssueTypeDetails(issueTypeData, id) {
  const issueType = issueTypeData?.data?.find(
    (issueType) => issueType.id === id
  );
  return issueType ? (
    <span
      style={{
        paddingLeft: "24px",
        backgroundImage: `url(${issueType.iconUrl})`,
        backgroundSize: "16px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {issueType.name} ({issueType.id})
    </span>
  ) : (
    `Deleted ${id}`
  );
}

function IssueAdjustmentContext({
  setCurrentContext,
  setCurrentIssueAdjustment,
  projectData,
  issueTypeData,
  openContextDeleteConfirmation,
  issueAdjustment,
  ...rest
}) {
  return (
    <div
      style={{
        backgroundColor: "#F4F5F7",
        padding: "15px",
      }}
    >
      <div>
        <h4>
          Issue adjustment {issueAdjustment.name} ({issueAdjustment.id})
        </h4>
        <h6>Data:</h6>
        <div
          style={{
            border: "1px solid rgb(193, 199, 208)",
            borderRadius: "3px",
          }}
        >
          <CodeBlock text={issueAdjustment.data} />
        </div>
      </div>
      <TableTree {...rest}>
        <Headers>
          <Header width="345px">Id</Header>
          <Header width="240px">Project</Header>
          <Header width="240px">Issue Type</Header>
          <Header width="120px">View Type</Header>
          <Header width="120px">Is available</Header>
          <Header width="120px">Actions</Header>
        </Headers>
        <Rows
          items={issueAdjustment.contexts}
          render={context => (
            <Row itemId={context.id}>
              <Cell singleLine>{context.id}</Cell>
              <Cell singleLine>
                {projectData
                  ? getProjectDetails(projectData, context.projectId)
                  : context.projectId}
              </Cell>
              <Cell singleLine>
                {issueTypeData
                  ? getIssueTypeDetails(issueTypeData, context.issueTypeId)
                  : context.issueTypeId}
              </Cell>
              <Cell singleLine>{context.viewType}</Cell>
              <Cell singleLine>{context.isAvailable ? "true" : "false"}</Cell>
              <Cell singleLine>
                <DropdownMenu
                  trigger={({ triggerRef, ...props }) => (
                    <Button
                      {...props}
                      iconBefore={<MoreIcon label="more" />}
                      ref={triggerRef}
                    />
                  )}
                  appearance="tall"
                >
                  <DropdownItemGroup>
                    <DropdownItem
                      onClick={() => {
                        setCurrentContext({
                          id: context.id,
                        });
                        setCurrentIssueAdjustment({
                          id: issueAdjustment.id,
                          name: issueAdjustment.name,
                          contexts: issueAdjustment.contexts,
                        });
                        openContextDeleteConfirmation();
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownItemGroup>
                </DropdownMenu>
              </Cell>
            </Row>
          )}
        />
      </TableTree>
    </div>
  );
}

function IssueAdjustments() {
  const [
    issueAdjustmentsContextCreateResult,
    setIssueAdjustmentsContextResult,
  ] = useState(null);
  const [issueAdjustments, setIssueAdjustments] = useState(null);
  const [updateTable, setUpdateTable] = useState(0);

  const [currentIssueAdjustment, setCurrentIssueAdjustment] = useState(null);
  const [currentContext, setCurrentContext] = useState(null);

  const [IssueAdjustmentsContextCreateModal, openCreateContextModal] =
    useIssueAdjustmentsContextCreateModal(
      currentIssueAdjustment,
      setUpdateTable,
      setIssueAdjustmentsContextResult
    );

  const [
    issueAdjustmentsContextDeleteResult,
    setIssueAdjustmentsContextDeleteResult,
  ] = useState(null);

  const [
    IssueAdjustmentsContextDeleteConfirmation,
    openContextDeleteConfirmation,
  ] = useIssueAdjustmentsContextDeleteConfirmation(
    currentIssueAdjustment,
    currentContext,
    setIssueAdjustmentsContextDeleteResult,
    setUpdateTable
  );

  const [issueAdjustmentsDeleteResult, setIssueAdjustmentsDeleteResult] =
    useState(null);

  const [IssueAdjustmentsDeleteConfirmation, openDeleteConfirmation] =
    useIssueAdjustmentsDeleteConfirmation(
      currentIssueAdjustment,
      setIssueAdjustmentsDeleteResult,
      setUpdateTable
    );

  useEffect(() => {
    invokeIssueAdjustments("GET /rest/api/3/issueAdjustments", {
      expands: {
        contexts: true,
        data: true,
      },
    }).then(data => {
      if ("data" in data) {
        data.data = JSON.parse(data.data);
      }
      if (data.data.values) {
        data.data.values = data.data.values.map((issueAdjustment) => {
          if (issueAdjustment.contexts) {
            issueAdjustment.contexts = issueAdjustment.contexts.map(
              (context) => {
                context.issueAdjustmentId = issueAdjustment.id;
                context.issueAdjustmentName = issueAdjustment.name;
                context.issueAdjustmentContexts = issueAdjustment.contexts;
                return context;
              }
            );
          }
          return issueAdjustment;
        });
      }

      setIssueAdjustments(data);
    });
  }, [updateTable]);

  const [projectData, setProjectData] = useState(null);
  const [issueTypeData, setIssueTypeData] = useState(null);

  useEffect(() => {
    invoke("GET projects", { expand: "urls" }).then(data => {
      if ("data" in data) {
        data.data = JSON.parse(data.data);
      }
      setProjectData(data);
    });
  }, []);

  useEffect(() => {
    invoke("GET issueTypes").then(data => {
      if ("data" in data) {
        data.data = JSON.parse(data.data);
      }
      setIssueTypeData(data);
    });
  }, []);

  let IssueAdjustments;

  if (issueAdjustments) {
    IssueAdjustments = (
      <TableTree>
        <Headers>
          <Header width="345px">Id</Header>
          <Header width="20%">Name</Header>
          <Header width="30%">Description</Header>
          <Header width="120px">Actions</Header>
        </Headers>
        <Rows
          items={issueAdjustments.data.values}
          render={issueAdjustment => {
            if (issueAdjustment.childrenRows) {
              // We are opening the expand
              return (
                <IssueAdjustmentContext
                  issueAdjustment={issueAdjustment.childrenRows}
                  projectData={projectData}
                  issueTypeData={issueTypeData}
                  openContextDeleteConfirmation={openContextDeleteConfirmation}
                  setCurrentIssueAdjustment={setCurrentIssueAdjustment}
                  setCurrentContext={setCurrentContext}
                />
              );
            }
            return (
              <Row
                itemId={issueAdjustment.id}
                hasChildren={true}
                items={[{ childrenRows: issueAdjustment }]}
              >
                <Cell singleLine>{issueAdjustment.id}</Cell>
                <Cell singleLine>{issueAdjustment.name}</Cell>
                <Cell singleLine>{issueAdjustment.description}</Cell>
                <Cell singleLine>
                  <DropdownMenu
                    trigger={({ triggerRef, ...props }) => (
                      <Button
                        {...props}
                        iconBefore={<MoreIcon label="more" />}
                        ref={triggerRef}
                      />
                    )}
                    appearance="tall"
                  >
                    <DropdownItemGroup>
                      <DropdownItem
                        onClick={() => {
                          setCurrentIssueAdjustment({
                            id: issueAdjustment.id,
                            name: issueAdjustment.name,
                            contexts: issueAdjustment.contexts,
                          });
                          openCreateContextModal();
                        }}
                      >
                        Add context...
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setCurrentIssueAdjustment({
                            id: issueAdjustment.id,
                            name: issueAdjustment.name,
                            contexts: issueAdjustment.contexts,
                          });
                          openDeleteConfirmation();
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownItemGroup>
                  </DropdownMenu>
                </Cell>
              </Row>
            );
          }}
        />
      </TableTree>
    );
  } else {
    IssueAdjustments = "Loading...";
  }

  return (
    <>
      <div>
        <h3>GET /rest/api/3/issueAdjustments?expand=contexts,data</h3>
        {IssueAdjustmentsContextCreateModal}
        {IssueAdjustmentsContextDeleteConfirmation}
        {IssueAdjustmentsDeleteConfirmation}
        {issueAdjustmentsContextCreateResult !== null ? (
          <FlagGroup>
            <Flag
              icon={null}
              description={issueAdjustmentsContextCreateResult}
              id="1"
              key="1"
              onDismissed={() => setIssueAdjustmentsContextResult(null)}
              title={
                <>
                  POST /rest/api/3/issueAdjustments/
                  {currentIssueAdjustment?.id}/contexts
                </>
              }
              actions={[
                {
                  content: "Ok",
                  onClick: () => setIssueAdjustmentsContextResult(null),
                },
              ]}
            />
          </FlagGroup>
        ) : null}
        {issueAdjustmentsContextDeleteResult !== null ? (
          <FlagGroup>
            <Flag
              icon={null}
              description={issueAdjustmentsContextDeleteResult}
              id="2"
              key="2"
              onDismissed={() => setIssueAdjustmentsContextDeleteResult(null)}
              title={
                <>
                  Delete context from Issue Adjustment by calling PUT /rest/api/3/issueAdjustments/
                    {currentIssueAdjustment?.id}
                </>
              }
              actions={[
                {
                  content: "Ok",
                  onClick: () => setIssueAdjustmentsContextDeleteResult(null),
                },
              ]}
            />
          </FlagGroup>
        ) : null}
        {issueAdjustmentsDeleteResult !== null ? (
          <FlagGroup>
            <Flag
              icon={null}
              description={issueAdjustmentsDeleteResult}
              id="3"
              key="3"
              onDismissed={() => setIssueAdjustmentsDeleteResult(null)}
              title={
                <>
                  DELETE /rest/api/3/issueAdjustments/
                  {currentIssueAdjustment?.id}
                </>
              }
              actions={[
                {
                  content: "Ok",
                  onClick: () => setIssueAdjustmentsDeleteResult(null),
                },
              ]}
            />
          </FlagGroup>
        ) : null}
        {IssueAdjustments}
      </div>
    </>
  );
}

export default IssueAdjustments;
