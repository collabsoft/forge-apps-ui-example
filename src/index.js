import api, { route } from '@forge/api';
import Resolver from '@forge/resolver';
import { logJson, define } from './resolver';

const jsonHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

let resolver = new Resolver();

define(resolver);

resolver.define('GET projects', async ({ payload }) => {
    const params = new URLSearchParams(payload.params || {});
    const requestURL = route`/rest/api/3/project/search?${params}`;

    console.log(requestURL);

    const res = await api.asApp().requestJira(requestURL, {
        headers: {
            ...jsonHeaders,
        },
    });

    const status = res;
    const data = await res.text();
    logJson(res, 'status');
    logJson(data, 'data');
    return { status, data };
});

resolver.define('GET issueTypes', async ({ payload }) => {
    const params = new URLSearchParams(payload.params || {});
    const requestURL = route`/rest/api/3/issuetype?${params}`;

    console.log(requestURL);

    const res = await api.asApp().requestJira(requestURL, {
        headers: {
            ...jsonHeaders,
        },
    });

    const status = res;
    const data = await res.text();
    logJson(res, 'status');
    logJson(data, 'data');
    return { status, data };
});

resolver.define('GET issueTypes/project', async ({ payload }) => {
    const params = new URLSearchParams(payload.params || {});
    const requestURL = route`/rest/api/3/issuetype/project?${params}`;

    console.log(requestURL);

    const res = await api.asApp().requestJira(requestURL, {
        headers: {
            ...jsonHeaders,
        },
    });

    const status = res;
    const data = await res.text();
    logJson(res, 'status');
    logJson(data, 'data');
    return { status, data };
});

export const handler = resolver.getDefinitions();
