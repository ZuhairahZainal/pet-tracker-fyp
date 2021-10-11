import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetPage } from './vet.page';

const routes: Routes = [
  {
    path: '',
    component: VetPage
  },
  {
    path: 'vet-detail/:id',
    loadChildren: () => import('./vet-detail/vet-detail.module').then( m => m.VetDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetPageRoutingModule {}
