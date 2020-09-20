import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/shared/service/api.service';


@Injectable({
    providedIn: 'root'
})
export class PostService {
    user: User;
    model: any;


    constructor(
        private apiService: ApiService,
    ) {
        this.user = new User();
    }


    getPostsList(data): Observable<any> {
        const query = data ? data : null;
        return this.apiService.get('auth', 'my-post-list', null, query );
    }

    savePost(action, data): Observable<any> {
        if (action && action === 'edit') {
            return this.apiService.post('auth', 'update-post', null, data);
        } else {
            return this.apiService.post('auth', 'create-post', null, data);
        }
    }
    deletePost(data): Observable<any> {
        return this.apiService.delete('auth', 'delete-post', null, data);
    }


}
