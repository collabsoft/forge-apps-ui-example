import api, { APIResponse, route } from '@forge/api';
import { UiModificationsEndpoints, UiModificationsMethod } from './constants';

export const logJson = (content, context = '') => {
    console.log(context, JSON.stringify(content, null, 2));
};

const jsonHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export async function uimResolver(endpoint, payload) {
    const params = new URLSearchParams();

    if ('expands' in payload) {
        let expands = [];
        if ('data' in payload.expands) {
            expands.push('data');
        }
        if ('contexts' in payload.expands) {
            expands.push('contexts');
        }

        if (expands.length) {
            params.append('expand', expands.join(','));
        }
    }

    let requestURL;

    let url = UiModificationsEndpoints[endpoint];

    if ('contextId' in payload) {
        url = url.replace('{contextId}', payload.contextId);
    }
    if ('id' in payload) {
        url = url.replace('{uiModificationId}', payload.id);
    }

    requestURL = route`${url}?${params}`;

    console.log('Request URL', requestURL);
    console.log('Method', UiModificationsMethod[endpoint]);

    const request = {
        method: UiModificationsMethod[endpoint],
        headers: {
            ...jsonHeaders,
        },
        body: null,
    };

    if ('body' in payload) {
        request.body = JSON.stringify(payload.body);
    }

    logJson(request.body, 'body');

    const res = await api.asApp().requestJira(requestURL, request);

    const status = res;
    const data = await res.text();

    logJson(status, requestURL);

    return { status, data };
}

export function define(resolver) {
    Object.keys(UiModificationsEndpoints).map((endpoint) => {
        resolver.define(endpoint, async ({ payload }) => {
            return await uimResolver(endpoint, payload);
        });
    });
}
