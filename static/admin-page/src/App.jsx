import { Content, Main, PageLayout } from '@atlaskit/page-layout';
import { view } from '@forge/bridge';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { ProjectIssueTypesTable } from './pages/ProjectIssueTypesTable';
import { UimTable } from './pages/UimTable';
import { UimCreateForm } from './pages/UimCreateForm';

function App() {
    const [history, setHistory] = useState(null);

    useEffect(() => {
        view.createHistory().then((newHistory) => {
            setHistory(newHistory);
        });
    }, []);

    const [historyState, setHistoryState] = useState(null);

    useEffect(() => {
        if (!historyState && history) {
            setHistoryState({
                action: history.action,
                location: history.location,
            });
        }
    }, [history, historyState]);

    useEffect(() => {
        if (history) {
            history.listen((location, action) => {
                setHistoryState({
                    action,
                    location,
                });
            });
        }
    }, [history]);

    const main = (
        <Main
            id="main-content"
            children={
                <div style={{ padding: '35px' }}>
                    {history && historyState ? (
                        <Routes
                            navigator={history}
                            navigationType={historyState.action}
                            location={historyState.location}
                        >
                            <Route path="/projectissuetypes" element={<ProjectIssueTypesTable />} />
                            <Route path="/ui-modifications" element={<UimTable />} />
                            <Route path="/new-ui-modification" element={<UimCreateForm />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    ) : (
                        'Loading...'
                    )}
                </div>
            }
        />
    );

    const content = <Content children={main} />;

    return <PageLayout children={content} />;
}

export default App;
