import { Field } from '@atlaskit/form';
import Select, { AsyncSelect } from '@atlaskit/select';
import { invoke } from '@forge/bridge';
import { useCallback, useEffect, useState } from 'react';

const ProjectissuetypeSelectors = ({ setSubmitDisabled }) => {
    const [project, setProject] = useState(null);
    const [issueType, setIssueType] = useState(null);

    useEffect(() => {
        setSubmitDisabled(!project || !issueType);
    }, [issueType, project]);

    const iconStyles = {
        singleValue: (provided, state) => {
            if (state?.data?.iconUrl) {
                return {
                    ...provided,
                    paddingLeft: '24px',
                    backgroundImage: `url(${state.data.iconUrl})`,
                    backgroundSize: '16px',
                    backgroundRepeat: 'no-repeat',
                };
            }

            return {
                ...provided,
            };
        },
        option: (provided, state) => {
            return {
                ...provided,
                paddingLeft: '36px',
                backgroundImage: `url(${state.data.iconUrl})`,
                backgroundSize: '16px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '8px 8px',
            };
        },
    };

    const projectOptions = useCallback(
        () =>
            new Promise((resolve) => {
                const payload = {
                    params: {
                        typeKey: 'software',
                    },
                };
                invoke('GET projects', payload).then((data) => {
                    if ('data' in data) {
                        data.data = JSON.parse(data.data);
                    }
                    resolve(
                        data.data.values
                            .map((project) => ({
                                iconUrl: project.avatarUrls['16x16'],
                                label: `(${project.id}) ${project.key} - ${project.name}`,
                                value: project.id,
                            })),
                    );
                });
            }),
        [],
    );

    const issueTypeOptions = useCallback((project) => {
        if (!project?.value) {
            return Promise.resolve([]);
        }

        return new Promise((resolve) => {
            invoke('GET issueTypes/project', {
                params: { projectId: project.value },
            }).then((data) => {
                if ('data' in data) {
                    data.data = JSON.parse(data.data);
                }
                resolve(
                    data.data.map((issueType) => ({
                        iconUrl: issueType.iconUrl,
                        label: `(${issueType.id}) ${issueType.name}`,
                        value: issueType.id,
                    })),
                );
            });
        });
    }, []);

    const IssueTypeField = !project?.value ? (
        <Field key="empty-issueType" name="issueType" label="Select an issue type">
            {() => <Select isDisabled={true} placeholder="Select a project" />}
        </Field>
    ) : (
        <Field
            key={`issueType-${project.value}`}
            name="issueType"
            label="Select an issue type"
            isRequired
        >
            {({ fieldProps: { onChange, ...rest } }) => (
                <AsyncSelect
                    inputId="async-select-issueType"
                    defaultOptions
                    styles={iconStyles}
                    onChange={(value) => {
                        onChange(value);
                        setIssueType(value);
                    }}
                    loadOptions={() => issueTypeOptions(project)}
                    {...rest}
                />
            )}
        </Field>
    );

    const ProjectField = (
        <Field key="project" name="project" label="Select a project" isRequired>
            {({ fieldProps: { onChange, ...rest } }) => (
                <AsyncSelect
                    inputId="async-select-project"
                    cacheOptions
                    defaultOptions
                    styles={iconStyles}
                    onChange={(value) => {
                        onChange(value);
                        setProject(value);
                    }}
                    loadOptions={projectOptions}
                    {...rest}
                />
            )}
        </Field>
    );

    return (
        <>
            {ProjectField}
            {IssueTypeField}
        </>
    );
};

export default ProjectissuetypeSelectors;
