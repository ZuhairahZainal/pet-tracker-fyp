import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundraiserPage } from './fundraiser.page';

const routes: Routes = [
  {
    path: '',
    component: FundraiserPage
  },
  {
    path: 'card-details/:id',
    loadChildren: () => import('./card-details/card-details.module').then( m => m.CardDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundraiserPageRoutingModule {}
