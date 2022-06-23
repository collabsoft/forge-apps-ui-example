import React from 'react';

function Home() {
    return (
        <>
            <h3>UI modifications example admin page</h3>
            <p>
                This example admin page was created to allow developers to focus on writing their
                first UI modifications without putting together the data and contexts for the UI
                modifications, manually.
            </p>
            <p>
                This is not a generic admin page for all the UI modifications created in this Jira
                instance. Apps <strong>cannot</strong> administer the UI modifications from other
                apps.
            </p>
            <p>This admin panel contains three pages:</p>
            <h4>New UI modification</h4>
            <p>
                Create a new UI modification with associated data. Each UI modification is expected
                to contain data that can be used at runtime. It is expected that the code written
                inside the UI modifications module will not be changed frequently, and minor (or
                major) customizations will be handled by reading the data and the context provided
                for each UI modification during the execution.
            </p>
            <h4>UI modifications contexts and data</h4>
            <p>
                The complete list of UI modifications that is owned by <strong>this app</strong> and
                the contexts they have been added into.
            </p>
            <h4>Projects & issue types</h4>
            <p>
                A list of ids and keys for the issue types and projects that this app has access to
                in this Jira instance.
            </p>
        </>
    );
}

export default Home;
