import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';
import {PGPService} from '../services/pgp-service';

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
    verifyAndLoadCode
};
