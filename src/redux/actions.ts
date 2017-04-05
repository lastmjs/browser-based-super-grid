import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';
import {PGPService} from '../services/pgp-service';

async function retrieveCode(repoURL: string, filePath: string): Promise<Action> {
    const sourceCode: string = await GithubService.loadFile(repoURL, filePath);
    return {
        type: 'STORE_SOURCE_CODE_INFO',
        sourceCode
    };
}

async function verifyCode(sourceCode: string, repoURL: string, signatureFilePath: string, keyID: string): Promise<Action> {
    const signature: string = await GithubService.loadFile(repoURL, signatureFilePath);
    const publicKey: string = await PGPService.loadPublicKey(keyID);
    const sourceCodeVerified: boolean = PGPService.verifySignature(sourceCode, signature, publicKey);

    return {
        type: 'SET_SOURCE_CODE_VERIFIED',
        sourceCodeVerified
    };
}

export const Actions = {
    retrieveCode,
    verifyCode
};
