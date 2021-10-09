import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionDetailsPage } from './adoption-details.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionDetailsPage
  },
  {
    path: 'edit-info/:id',
    loadChildren: () => import('./edit-info/edit-info.module').then( m => m.EditInfoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionDetailsPageRoutingModule {}
