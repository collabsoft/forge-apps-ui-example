import { Content, LeftSidebar, Main, PageLayout } from '@atlaskit/page-layout';
import {
    ButtonItem,
    Header,
    NavigationContent,
    NavigationHeader,
    Section,
    SideNavigation,
} from '@atlaskit/side-navigation';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import { ProjectIssueTypesTable } from './pages/ProjectIssueTypesTable';
import { UimTable } from './pages/UimTable';
import { UimCreateForm } from './pages/UimCreateForm';

function App() {
    const navigate = useNavigate();

    const sidebar = (
        <SideNavigation label="project">
            <NavigationHeader>
                <Header>Unbox UI modification</Header>
            </NavigationHeader>
            <NavigationContent>
                <Section>
                    <ButtonItem onClick={() => navigate('/')}>Home</ButtonItem>
                    <ButtonItem onClick={() => navigate('/ui-modifications/new')}>
                        New UI modification
                    </ButtonItem>
                    <ButtonItem onClick={() => navigate('/ui-modifications')}>
                        UI modification contexts and data
                    </ButtonItem>
                    <ButtonItem onClick={() => navigate('/projectissuetypes')}>
                        Projects & Issue types
                    </ButtonItem>
                </Section>
            </NavigationContent>
        </SideNavigation>
    );

    const leftSidebar = (
        <LeftSidebar isFixed={true} width={150} id="project-navigation" children={sidebar} />
    );

    const main = (
        <Main
            id="main-content"
            children={
                <div style={{ padding: '35px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projectissuetypes" element={<ProjectIssueTypesTable />} />
                        <Route path="/ui-modifications" element={<UimTable />} />
                        <Route path="/ui-modifications/new" element={<UimCreateForm />} />
                    </Routes>
                </div>
            }
        />
    );

    const content = <Content children={[leftSidebar, main]} />;

    return <PageLayout children={content} />;
}

export default App;
