import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostpetDetailsPage } from './lostpet-details.page';

const routes: Routes = [
  {
    path: '',
    component: LostpetDetailsPage
  },
  {
    path: 'edit-info',
    loadChildren: () => import('./edit-info/edit-info.module').then( m => m.EditInfoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostpetDetailsPageRoutingModule {}
