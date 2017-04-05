async function loadPublicKey(keyID: string): Promise<string> {
    const hkp = new window.openpgp.HKP('https://pgp.mit.edu');
    const options = {
        keyId: keyID
    };
    const key = await hkp.lookup(options);
    return key;
}

async function verifySignature(message: string, signature: string, publicKey: string): boolean {
    console.log(signature);
    // console.log(signature);
    // const armoredSignature = window.openpgp.message.read(signature);
    // console.log(armoredSignature);
    // const armoredSignature = window.openpgp.armor.encode(window.openpgp.enums.armor.signature, signature, 0, 0);
    // const armoredPublicKey = window.openpgp.armor.encode(window.openpgp.enums.armor.public_key, publicKey, 0, 0);

    const options = {
        message: window.openpgp.cleartext.readArmored(message),
        signature: window.openpgp.signature.readArmored(signature),
        publicKeys: window.openpgp.key.readArmored(publicKey).keys
    };
    // const options = {
    //     message: new window.openpgp.cleartext.CleartextMessage(signature),
    //     publicKeys: publicKey
    // };
    // const verified = await window.openpgp.verify(options);

    const verified = window.openpgp.crypto.signature.verify(publicKey, signature);

    console.log(verified);

    return verified.signatures[0].valid;
}

export const PGPService = {
    loadPublicKey,
    verifySignature
};
