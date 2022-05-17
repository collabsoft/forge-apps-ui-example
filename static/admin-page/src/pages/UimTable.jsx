import Button from '@atlaskit/button/standard-button';
import { CodeBlock } from '@atlaskit/code';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Flag, { FlagGroup } from '@atlaskit/flag';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { invoke } from '@forge/bridge';

import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import React, { useEffect, useState } from 'react';
import { invokeUiModifications } from '../invokeUiModifications';
import { useContextDeleteConfirmation } from '../modals/useContextDeleteConfirmation';
import useDeleteUimConfirmation from '../modals/useDeleteUimConfirmation';
import { useContextCreateModal } from '../modals/useContextCreateModal';

function getProjectDetails(projectData, id) {
    const project = projectData?.data?.values.find((project) => project.id === id);
    return project ? (
        <span
            style={{
                paddingLeft: '24px',
                backgroundImage: `url(${project.avatarUrls['16x16']})`,
                backgroundSize: '16px',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {project.name} ({project.key})
        </span>
    ) : (
        `Deleted ${id}`
    );
}
function getIssueTypeDetails(issueTypeData, id) {
    const issueType = issueTypeData?.data?.find((issueType) => issueType.id === id);
    return issueType ? (
        <span
            style={{
                paddingLeft: '24px',
                backgroundImage: `url(${issueType.iconUrl})`,
                backgroundSize: '16px',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {issueType.name} ({issueType.id})
        </span>
    ) : (
        `Deleted ${id}`
    );
}

function UiModificationContext({
    setCurrentContext,
    setCurrentUiModification,
    projectData,
    issueTypeData,
    openContextDeleteConfirmation,
    uiModification,
    ...rest
}) {
    return (
        <div
            style={{
                backgroundColor: '#F4F5F7',
                padding: '15px',
            }}
        >
            <div>
                <h4>
                    UI modification {uiModification.name} ({uiModification.id})
                </h4>
                <h6>Data:</h6>
                <div
                    style={{
                        border: '1px solid rgb(193, 199, 208)',
                        borderRadius: '3px',
                    }}
                >
                    <CodeBlock text={uiModification.data} />
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
                    items={uiModification.contexts}
                    render={(context) => (
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
                            <Cell singleLine>{context.isAvailable ? 'true' : 'false'}</Cell>
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
                                                setCurrentUiModification({
                                                    id: uiModification.id,
                                                    name: uiModification.name,
                                                    contexts: uiModification.contexts,
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

export function UimTable() {
    const [uimContextCreateResult, setUimContextResult] = useState(null);
    const [uiModification, setUiModification] = useState(null);
    const [updateTable, setUpdateTable] = useState(0);

    const [currentUiModification, setCurrentUiModification] = useState(null);
    const [currentContext, setCurrentContext] = useState(null);

    const [UimContextCreateModal, openCreateContextModal] = useContextCreateModal(
        currentUiModification,
        setUpdateTable,
        setUimContextResult,
    );

    const [uimContextDeleteResult, setUimContextDeleteResult] = useState(null);

    const [UimContextDeleteConfirmation, openContextDeleteConfirmation] =
        useContextDeleteConfirmation(
            currentUiModification,
            currentContext,
            setUimContextDeleteResult,
            setUpdateTable,
        );

    const [UimDeleteResult, setUimDeleteResult] = useState(null);

    const [UimDeleteConfirmation, openDeleteConfirmation] = useDeleteUimConfirmation(
        currentUiModification,
        setUimDeleteResult,
        setUpdateTable,
    );

    useEffect(() => {
        invokeUiModifications('GET /rest/api/3/uiModifications', {
            expands: {
                contexts: true,
                data: true,
            },
        }).then((data) => {
            if ('data' in data) {
                data.data = JSON.parse(data.data);
            }

            setUiModification(data);
        });
    }, [updateTable]);

    const [projectData, setProjectData] = useState(null);
    const [issueTypeData, setIssueTypeData] = useState(null);

    useEffect(() => {
        invoke('GET projects', { expand: 'urls' }).then((data) => {
            if ('data' in data) {
                data.data = JSON.parse(data.data);
            }
            setProjectData(data);
        });
    }, []);

    useEffect(() => {
        invoke('GET issueTypes').then((data) => {
            if ('data' in data) {
                data.data = JSON.parse(data.data);
            }
            setIssueTypeData(data);
        });
    }, []);

    let UiModifications;

    if (uiModification) {
        UiModifications = (
            <TableTree>
                <Headers>
                    <Header width="345px">Id</Header>
                    <Header width="20%">Name</Header>
                    <Header width="30%">Description</Header>
                    <Header width="120px">Actions</Header>
                </Headers>
                <Rows
                    items={uiModification.data.values}
                    render={(uiModification) => {
                        if (uiModification.childrenRows) {
                            // We are opening the expand
                            return (
                                <UiModificationContext
                                    uiModification={uiModification.childrenRows}
                                    projectData={projectData}
                                    issueTypeData={issueTypeData}
                                    openContextDeleteConfirmation={openContextDeleteConfirmation}
                                    setCurrentUiModification={setCurrentUiModification}
                                    setCurrentContext={setCurrentContext}
                                />
                            );
                        }
                        return (
                            <Row
                                itemId={uiModification.id}
                                hasChildren={true}
                                items={[{ childrenRows: uiModification }]}
                            >
                                <Cell singleLine>{uiModification.id}</Cell>
                                <Cell singleLine>{uiModification.name}</Cell>
                                <Cell singleLine>{uiModification.description}</Cell>
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
                                                    setCurrentUiModification({
                                                        id: uiModification.id,
                                                        name: uiModification.name,
                                                        contexts: uiModification.contexts,
                                                    });
                                                    openCreateContextModal();
                                                }}
                                            >
                                                Add context...
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => {
                                                    setCurrentUiModification({
                                                        id: uiModification.id,
                                                        name: uiModification.name,
                                                        contexts: uiModification.contexts,
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
        UiModifications = 'Loading...';
    }

    return (
        <>
            <div>
                <h3>GET /rest/api/3/uiModifications?expand=contexts,data</h3>
                {UimContextCreateModal}
                {UimContextDeleteConfirmation}
                {UimDeleteConfirmation}
                {uimContextCreateResult !== null ? (
                    <FlagGroup>
                        <Flag
                            icon={null}
                            description={uimContextCreateResult}
                            id="1"
                            key="1"
                            onDismissed={() => setUimContextResult(null)}
                            title={
                                <>
                                    POST /rest/api/3/uiModifications/
                                    {currentUiModification?.id}/contexts
                                </>
                            }
                            actions={[
                                {
                                    content: 'Ok',
                                    onClick: () => setUimContextResult(null),
                                },
                            ]}
                        />
                    </FlagGroup>
                ) : null}
                {uimContextDeleteResult !== null ? (
                    <FlagGroup>
                        <Flag
                            icon={null}
                            description={uimContextDeleteResult}
                            id="2"
                            key="2"
                            onDismissed={() => setUimContextDeleteResult(null)}
                            title={
                                <>
                                    Delete context from UI modification by calling PUT
                                    /rest/api/3/uiModifications/
                                    {currentUiModification?.id}
                                </>
                            }
                            actions={[
                                {
                                    content: 'Ok',
                                    onClick: () => setUimContextDeleteResult(null),
                                },
                            ]}
                        />
                    </FlagGroup>
                ) : null}
                {UimDeleteResult !== null ? (
                    <FlagGroup>
                        <Flag
                            icon={null}
                            description={UimDeleteResult}
                            id="3"
                            key="3"
                            onDismissed={() => setUimDeleteResult(null)}
                            title={
                                <>
                                    DELETE /rest/api/3/uiModifications/
                                    {currentUiModification?.id}
                                </>
                            }
                            actions={[
                                {
                                    content: 'Ok',
                                    onClick: () => setUimDeleteResult(null),
                                },
                            ]}
                        />
                    </FlagGroup>
                ) : null}

                {UiModifications}
            </div>
        </>
    );
}
