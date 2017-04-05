import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';

async function retrieveCode(repoURL: string, filePath: string): Promise<Action> {
    const sourceCode: string = await GithubService.loadFile(repoURL, filePath);
    return {
        type: 'STORE_SOURCE_CODE_INFO',
        sourceCode
    };
}

export const Actions = {
    retrieveCode
};
