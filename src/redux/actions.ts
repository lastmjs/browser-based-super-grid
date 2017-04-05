import {Action} from '../typings/action';

async function retrieveCode(rawURL: string, filePath: string): Promise<Action> {
    const url: URL = new URL(rawURL);
    const sourceCodeURL: string = `https://raw.githubusercontent.com${url.pathname}/master/${filePath}`;
    const response = await window.fetch(sourceCodeURL);
    const sourceCode: string = await response.text();

    return {
        type: 'STORE_SOURCE_CODE_INFO',
        sourceCode,
        sourceCodeURL
    };
}

export const Actions = {
    retrieveCode
};
