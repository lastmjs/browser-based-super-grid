export interface Action {
    readonly type: string;
    readonly sourceCode?: string;
    readonly sourceCodeVerified?: boolean;
}
