async function loadPublicKey(keyID: string): Promise<string> {
    const hkp = new window.openpgp.HKP('https://pgp.mit.edu');
    const options = {
        keyId: keyID
    };
    const key = await hkp.lookup(options);
    return key;
}

async function verifySignature(signature: string, publicKey: string) {
    try {
        const options = {
            message: window.openpgp.cleartext.readArmored(signature),
            publicKeys: window.openpgp.key.readArmored(publicKey).keys
        };
        const verified = await window.openpgp.verify(options);
        return {
            sourceCode: verified.data,
            sourceCodeVerified: verified.signatures[0].valid
        };
    }
    catch(error) {
        return {
            sourceCode: error,
            sourceCodeVerified: false
        };
    }
}

export const PGPService = {
    loadPublicKey,
    verifySignature
};
