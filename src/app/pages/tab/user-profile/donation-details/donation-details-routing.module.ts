import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationDetailsPage } from './donation-details.page';

const routes: Routes = [
  {
    path: '',
    component: DonationDetailsPage
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
export class DonationDetailsPageRoutingModule {}
