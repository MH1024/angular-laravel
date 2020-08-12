

export class User {

    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt: string;
    updateAt: string;
    role: string;

    constructor(user?) {
        this.email = (user && user.email) ? user.email : '';
        this.firstName = (user && user.first_name) ? user.first_name : '';
        this.lastName = (user && user.last_name) ? user.last_name : '';
        this.active = (user && user.active) ? user.active : '';
        this.createdAt = (user && user.created_at) ? user.created_at : '';
        this.updateAt = (user && user.update_at) ? user.update_at : '';
        this.role = (user && user.role) ? user.role : 'visitor';
    }

}
