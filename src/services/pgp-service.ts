async function loadPublicKey(keyID: string): Promise<string> {
    const hkp = new window.openpgp.HKP('https://pgp.mit.edu');
    const options = {
        keyId: keyID
    };
    const key = await hkp.lookup(options);
    return key;
}

function verifySignature(message: string, signature: string, publicKey: string): boolean {
    return true;
}

export const PGPService = {
    loadPublicKey,
    verifySignature
};
