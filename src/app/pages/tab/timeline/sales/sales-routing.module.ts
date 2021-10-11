import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPage } from './sales.page';

const routes: Routes = [
  {
    path: '',
    component: SalesPage
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'sales-history',
    loadChildren: () => import('./sales-history/sales-history.module').then( m => m.SalesHistoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPageRoutingModule {}
