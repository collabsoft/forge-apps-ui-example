import Button from "@atlaskit/button/standard-button";
import { CodeBlock } from "@atlaskit/code";
import Form, { Field, FormFooter } from "@atlaskit/form";
import TextArea from "@atlaskit/textarea";
import TextField from "@atlaskit/textfield";
import React, { useState, useEffect } from "react";
import { invokeIssueAdjustments } from "../invokeIssueAdjustments";

function createIssueAdjustments(data, setIssueAdjustmentResult) {
  invokeIssueAdjustments("POST /rest/api/3/issueAdjustments", {
    body: {
      name: data["ia-name"],
      description: data["ia-description"],
      data: data["ia-data"],
    },
  }).then(data => {
    if ("data" in data && data.data !== "") {
      data.data = JSON.parse(data.data);
    }
    setIssueAdjustmentResult(JSON.stringify(data.data, null, 2));
  });
}

function IssueAdjustmentsForm() {
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [issueAdjustmentResult, setIssueAdjustmentResult] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (issueAdjustmentResult) setSubmitDisabled(false);
  }, [issueAdjustmentResult])

  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        margin: "0 auto",
        minHeight: "60vh",
        flexDirection: "column",
      }}
    >
      <h1>Create issue adjustment</h1>
      <Form
        onSubmit={(data) => {
          setIssueAdjustmentResult(null);
          setSubmitDisabled(true);
          createIssueAdjustments(data, setIssueAdjustmentResult);
        }}
      >
        {({ formProps }) => (
          <form {...formProps}>
            <Field
              key="ia-name"
              name="ia-name"
              label="Name the issue adjustment"
              isRequired
            >
              {({ fieldProps: { onChange, ...rest } }) => (
                <TextField
                  id="ia-name"
                  onChange={event => {
                    onChange(event);
                    setName(event.target.value);
                  }}
                  {...rest}
                />
              )}
            </Field>
            <Field
              key="ia-description"
              name="ia-description"
              label="Description"
            >
              {({ fieldProps }) => (
                <TextField id="ia-description" {...fieldProps} />
              )}
            </Field>
            <Field
              key="ia-data"
              name="ia-data"
              label="Add some data to the issue adjustment"
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
      {issueAdjustmentResult ? (
        <>
          <h3>Issue adjustment created</h3>
          <CodeBlock text={issueAdjustmentResult}></CodeBlock>
        </>
      ) : null}
    </div>
  );
}

export default IssueAdjustmentsForm;
