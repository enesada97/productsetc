import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ProductsComponent } from './products/products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RatingModule } from 'ng-starrating';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../core/services/comment.service';

@NgModule({
  declarations: [ProductsComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    RatingModule,
    MatTabsModule,
    MatIconModule,
  ],
  providers: [ProductService,CommentService]
})
export class MainModule {}
