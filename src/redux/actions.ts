import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';
import {PGPService} from '../services/pgp-service';

function persistParameters(repoURL: string, filePath: string, keyID: string) {
    window.localStorage.setItem('repoURL', repoURL);
    window.localStorage.setItem('filePath', filePath);
    window.localStorage.setItem('keyID', keyID);

    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID
    };
}

function retrieveParameters() {
    const repoURL: string = window.localStorage.getItem('repoURL');
    const filePath: string = window.localStorage.getItem('filePath');
    const keyID: string = window.localStorage.getItem('keyID');

    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID
    };
}

async function verifyAndLoadCode(signature: string, keyID: string): Promise<Action> {
    const publicKey: string = await PGPService.loadPublicKey(keyID);
    const {sourceCode, sourceCodeVerified} = await PGPService.verifySignature(signature, publicKey);

    return {
        type: 'SET_SOURCE_CODE_INFO',
        sourceCode,
        sourceCodeVerified
    };
}

export const Actions = {
    verifyAndLoadCode,
    persistParameters,
    retrieveParameters
};
