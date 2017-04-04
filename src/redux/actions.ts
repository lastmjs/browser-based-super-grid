function retrieveCode(url: string) {
    const sourceCode: string = url;

    //TODO go to GitHub with the url and retrieve the source code

    return {
        type: 'STORE_SOURCE_CODE',
        sourceCode
    };
}

function executeCode(component) {

}

export const Actions = {
    executeCode,
    retrieveCode
};
