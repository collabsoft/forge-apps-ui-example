import Button from '@atlaskit/button/standard-button';
import { CodeBlock } from '@atlaskit/code';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import React, { useState, useEffect } from 'react';
import { invokeUiModifications } from '../invokeUiModifications';

function createUiModification(data, setUiModificationResult) {
    invokeUiModifications('POST /rest/api/3/uiModifications', {
        body: {
            name: data['ia-name'],
            description: data['ia-description'],
            data: data['ia-data'],
        },
    }).then((data) => {
        if ('data' in data && data.data !== '') {
            data.data = JSON.parse(data.data);
        }
        setUiModificationResult(JSON.stringify(data.data, null, 2));
    });
}

export function UimCreateForm() {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const [uiModificationResult, setUiModificationResult] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        if (uiModificationResult) setSubmitDisabled(false);
    }, [uiModificationResult]);

    return (
        <div
            style={{
                display: 'flex',
                width: '400px',
                margin: '0 auto',
                minHeight: '60vh',
                flexDirection: 'column',
            }}
        >
            <h1>Create UI modification</h1>
            <Form
                onSubmit={(data) => {
                    setUiModificationResult(null);
                    setSubmitDisabled(true);
                    createUiModification(data, setUiModificationResult);
                }}
            >
                {({ formProps }) => (
                    <form {...formProps}>
                        <Field
                            key="ia-name"
                            name="ia-name"
                            label="Name the UI modification"
                            isRequired
                        >
                            {({ fieldProps: { onChange, ...rest } }) => (
                                <TextField
                                    id="ia-name"
                                    onChange={(event) => {
                                        onChange(event);
                                        setName(event.target.value);
                                    }}
                                    {...rest}
                                />
                            )}
                        </Field>
                        <Field key="ia-description" name="ia-description" label="Description">
                            {({ fieldProps }) => <TextField id="ia-description" {...fieldProps} />}
                        </Field>
                        <Field
                            key="ia-data"
                            name="ia-data"
                            label="Add some data to the UI modification"
                        >
                            {({ fieldProps }) => (
                                <TextArea
                                    resize="auto"
                                    maxHeight="20vh"
                                    id="ia-data"
                                    isMonospaced={true}
                                    {...fieldProps}
                                />
                            )}
                        </Field>
                        <FormFooter>
                            <Button
                                isDisabled={!name.length || isSubmitDisabled}
                                type="submit"
                                appearance="primary"
                            >
                                Submit
                            </Button>
                        </FormFooter>
                    </form>
                )}
            </Form>
            {uiModificationResult ? (
                <>
                    <h3>UI modification created</h3>
                    <CodeBlock text={uiModificationResult}></CodeBlock>
                </>
            ) : null}
        </div>
    );
}
