import { User } from './user.model';

export class Post {
    id: number;
    title: string;
    body: string;
    excerpt: string;
    createdAt: string;
    updatedAt: string;
    author: User;

    constructor(post?) {
        this.id = (post && post.id) ? post.id : null;
        this.title = (post && post.title) ? post.title : '';
        this.body = (post && post.body) ? post.body : '';
        this.excerpt = (post && post.excerpt) ? post.excerpt : '';
        this.createdAt = (post && post.created_at) ? post.created_at : '';
        this.updatedAt = (post && post.updated_at) ? post.updated_at : '';
        this.author = (post && post.user && post.user !== {}) ? new User(post.user) : new User();
    }

}
