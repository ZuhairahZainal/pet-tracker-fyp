import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimelinePage } from './timeline.page';

const routes: Routes = [
  {
    path: '',
    component: TimelinePage
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimelinePageRoutingModule {}
