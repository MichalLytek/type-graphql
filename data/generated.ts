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

/**
 * User model comment
 */
export class User {
    /**
     * User model field comment
     */
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
