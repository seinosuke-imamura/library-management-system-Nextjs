export type Role = "ADMIN" | "STAFF" | "USER";

export type AuthUser = {
    id: string;
    username: string;
    role: Role;
};
