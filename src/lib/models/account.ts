export type User = {
    id: string;
    isActive: boolean;
    username: string;
    email: string;
    password?: string | null;
    roleName: string;
};