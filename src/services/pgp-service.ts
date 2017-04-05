async function loadPublicKey(keyID: string): Promise<string> {
    return 'this is the public key';
}

function verifySignature(message: string, signature: string, publicKey: string): boolean {
    return true;
}

export const PGPService = {
    loadPublicKey,
    verifySignature
};
