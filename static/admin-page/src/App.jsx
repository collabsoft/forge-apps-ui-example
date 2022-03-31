import { Content, LeftSidebar, Main, PageLayout } from "@atlaskit/page-layout";
import {
  ButtonItem, Header, NavigationContent,
  NavigationHeader,
  Section,
  SideNavigation
} from "@atlaskit/side-navigation";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import IssueAdjustmentsCreateForm from "./pages/IssueAdjustmentsCreateForm";
import IssueAdjustmentsTable from "./pages/IssueAdjustmentsTable";
import Projectissuetypes from "./pages/ProjectissuetypesTable";


function App() {
  const navigate = useNavigate();

  const sidebar = (
    <SideNavigation label="project">
      <NavigationHeader>
        <Header>IA app</Header>
      </NavigationHeader>
      <NavigationContent>
        <Section>
          <ButtonItem onClick={() => navigate("/")}>Home</ButtonItem>
          <ButtonItem onClick={() => navigate("/issueAdjustments/new")}>
            New issue adjustment
          </ButtonItem>
          <ButtonItem onClick={() => navigate("/issueAdjustments")}>
            Issue adjustment contexts and data
          </ButtonItem>
          <ButtonItem onClick={() => navigate("/projectissuetypes")}>
            Projects & Issue types
          </ButtonItem>
        </Section>
      </NavigationContent>
    </SideNavigation>
  );

  const leftSidebar = (
    <LeftSidebar
      isFixed={true}
      width={150}
      id="project-navigation"
      children={sidebar}
    />
  );

  const main = (
    <Main
      id="main-content"
      children={
        <div style={{ padding: "35px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projectissuetypes" element={<Projectissuetypes />} />
            <Route
              path="/issueAdjustments"
              element={<IssueAdjustmentsTable />}
            />
            <Route
              path="/issueAdjustments/new"
              element={<IssueAdjustmentsCreateForm />}
            />
          </Routes>
        </div>
      }
    />
  );

  const content = <Content children={[leftSidebar, main]} />;

  return <PageLayout children={content} />;
}

export default App;
