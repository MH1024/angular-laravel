

export class User {

    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    role: string;

    constructor(user?) {
        this.email = (user && user.email) ? user.email : '';
        this.name = (user && user.name) ? user.name : '';
        this.createdAt = (user && user.created_at) ? user.created_at : '';
        this.updatedAt = (user && user.updated_at) ? user.updated_at : '';
        this.role = (user && user.role) ? user.role : 'visitor';
    }

}
