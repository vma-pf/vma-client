export type Camera = {
    id: string;
    protocol: string;
    domain: string;
    path: string;
    parameters: string;
    port: number;
    username?: string;
    password?: string;
    cageIds: string[];
};