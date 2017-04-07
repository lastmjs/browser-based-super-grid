export interface Action {
    readonly type: string;
    readonly sourceCode?: string;
    readonly sourceCodeVerified?: boolean;
    readonly repoURL?: string;
    readonly filePath?: string;
    readonly keyID?: string;
    readonly peerID?: string;
}
