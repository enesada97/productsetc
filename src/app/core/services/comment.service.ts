import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/products.model';
import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Product[]>(`/comments`);
    }

    getByProductId(id: number) {
        return this.http.get<Comment[]>(`/comments/` + id);
    }

    add(comment: Comment) {
        return this.http.post(`/comments/add`, comment);
    }
}
