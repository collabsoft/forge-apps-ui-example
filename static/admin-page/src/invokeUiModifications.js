import { invoke } from '@forge/bridge';

export async function invokeUiModifications(endpoint, payload) {
    return invoke(endpoint, payload);
}
