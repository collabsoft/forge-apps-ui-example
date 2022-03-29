import React from "react";

function Home() {
  return (
    <>
      <h3>Issue Adjustments admin page</h3>
      <p>
        Use this page to administer in which contexts the issue adjustments in
        this app will run.
      </p>
      <p>
        You <strong>cannot</strong> administer all the issue adjustments from
        all the issue adjustments apps from this panel.
      </p>
      <h4>New issue adjustment</h4>
      <p>
        Create new issue adjustments. This is how we include different data into
        the issue adjustments
      </p>
      <h4>Issue adjustment contexts and data</h4>
      <p>
        A complete list of the contexts for <strong>this app</strong>.
      </p>
      <h4>Projects & issue types</h4>
      <p>A list of ids and keys for the issue types and projects</p>
    </>
  );
}

export default Home;
