export type User = {
    id: string;
    birthday: string;
    isActive: boolean;
    username: string;
    email: string;
    roles: {
        roleId: string;
        role: {
            id: string;
            name: string;
        }
    }[];
};