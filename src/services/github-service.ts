async function loadFile(repoURL: string, filePath: string): Promise<string> {
    const url: URL = new URL(repoURL);
    const sourceCodeURL: string = `https://raw.githubusercontent.com${url.pathname}/master/${filePath}`;
    const response = await window.fetch(sourceCodeURL);
    const sourceCode: string = await response.text();

    return sourceCode;
}

export const GithubService = {
    loadFile
};
