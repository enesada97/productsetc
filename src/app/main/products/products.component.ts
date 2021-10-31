import { ProductService } from './../../core/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/products.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  loading = false;
  products: Product[];
  constructor(
    private productService:ProductService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.productService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.products = users;
        console.log(this.products);

    });
}

}
