import {Action} from '../typings/action';

async function retrieveCode(rawURL: string, filePath: string): Promise<Action> {
    const url: URL = new URL(rawURL);
    const combinedURL: string = `https://raw.githubusercontent.com${url.pathname}/master/${filePath}`;
    const response = await window.fetch(combinedURL);
    const sourceCode: string = await response.text();

    return {
        type: 'STORE_SOURCE_CODE',
        sourceCode
    };
}

function executeSourceCode(component: HTMLElement, sourceCode: string) {
    eval(sourceCode);
}

export const Actions = {
    executeSourceCode,
    retrieveCode
};
