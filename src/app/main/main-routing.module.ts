import { AuthGuard } from './../core/guard/auth.guard';
import { ProductsComponent } from './products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    canActivate:[AuthGuard]
  },
  // { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
