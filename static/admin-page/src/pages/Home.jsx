import React from 'react';

function Home() {
    return (
        <>
            <h3>UI modifications - admin page</h3>
            <p>
                Use this page to administer in which contexts the UI modifications in this app will
                run.
            </p>
            <p>
                You <strong>cannot</strong> administer all the UI modifications from all the UI
                modifications apps from this panel.
            </p>
            <h4>New UI modification</h4>
            <p>
                Create new UI modification. This is how we include different data into the UI
                modifications
            </p>
            <h4>UI modifications contexts and data</h4>
            <p>
                A complete list of the contexts for <strong>this app</strong>.
            </p>
            <h4>Projects & issue types</h4>
            <p>A list of ids and keys for the issue types and projects</p>
        </>
    );
}

export default Home;
