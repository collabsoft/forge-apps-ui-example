import { CodeBlock } from '@atlaskit/code';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { invoke } from '@forge/bridge';
import React, { useEffect, useState } from 'react';

export function ProjectIssueTypesTable() {
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

    const Projects = projectData ? (
        <Tabs id="default">
            <TabList>
                <Tab>Table</Tab>
                <Tab>Request</Tab>
            </TabList>
            <TabPanel>
                <table>
                    <thead>
                        <th>Id</th>
                        <th>Key</th>
                        <th>Name</th>
                        <th>Project type</th>
                        <th></th>
                    </thead>
                    {projectData.data.values.map((project) => (
                        <tr key={project.id}>
                            <td key={project.id}>{project.id}</td>
                            <td key={project.key}>{project.key}</td>
                            <td key={project.name}>{project.name}</td>
                            <td key={project.projectTypeKey}>{project.projectTypeKey}</td>
                            <td key={project.simplified}>
                                {project.simplified ? 'Team-managed' : 'Company-managed'}
                            </td>
                        </tr>
                    ))}
                </table>
            </TabPanel>
            <TabPanel>
                <CodeBlock css={{ height: '80vh' }} text={JSON.stringify(projectData, null, 2)} />
            </TabPanel>
        </Tabs>
    ) : (
        'Loading...'
    );

    useEffect(() => {
        invoke('GET issueTypes').then((data) => {
            if ('data' in data) {
                data.data = JSON.parse(data.data);
            }
            setIssueTypeData(data);
        });
    }, []);

    const IssueTypes = issueTypeData ? (
        <Tabs id="default">
            <TabList>
                <Tab>Table</Tab>
                <Tab>Request</Tab>
            </TabList>
            <TabPanel>
                <table>
                    <thead>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Hierarchy</th>
                        <th>Scope</th>
                    </thead>
                    {issueTypeData.data.map((issueType) => (
                        <tr key={issueType.id}>
                            <td key={issueType.id}>{issueType.id}</td>
                            <td key={issueType.name}>{issueType.name}</td>
                            <td key={issueType.hierarchyLevel}>
                                {issueType.hierarchyLevel === 1
                                    ? 'Epic'
                                    : issueType.hierarchyLevel === 0
                                    ? 'Base'
                                    : 'Subtask'}
                            </td>
                            <td key={issueType.scope}>
                                {issueType.scope
                                    ? `${issueType.scope.type}: ${issueType.scope?.project?.id}`
                                    : 'None'}
                            </td>
                        </tr>
                    ))}
                </table>
            </TabPanel>
            <TabPanel>
                <CodeBlock css={{ height: '80vh' }} text={JSON.stringify(issueTypeData, null, 2)} />
            </TabPanel>
        </Tabs>
    ) : (
        'Loading...'
    );

    return (
        <>
            <div>
                <h3>Projects</h3>
                {Projects}
            </div>
            <div>
                <h3>Issue Types</h3>
                {IssueTypes}
            </div>
        </>
    );
}
