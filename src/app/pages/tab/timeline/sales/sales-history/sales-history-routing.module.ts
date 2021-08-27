import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesHistoryPage } from './sales-history.page';

const routes: Routes = [
  {
    path: '',
    component: SalesHistoryPage
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'edit-product',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesHistoryPageRoutingModule {}
