import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/products.model';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Product[]>(`/products`);
    }

    getById(id: number) {
        return this.http.get(`/products/` + id);
    }

    register(user: Product) {
        return this.http.post(`/products/register`, user);
    }

    update(user: Product) {
        return this.http.put(`/products/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/products/` + id);
    }
}
