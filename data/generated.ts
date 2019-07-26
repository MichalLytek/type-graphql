/**
 * Role enum comment
 */
export enum Role {
    USER,
    ADMIN
}

export enum PostKind {
    BLOG,
    ADVERT
}

export class User {
    id!: string;
    email!: string;
    name?: string;
    age!: number;
    balance!: number;
    amount!: number;
    posts?: Post[];
    role!: Role;
}

export class Post {
    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    published!: boolean;
    title!: string;
    content?: string;
    author?: User;
    kind?: PostKind;
}
