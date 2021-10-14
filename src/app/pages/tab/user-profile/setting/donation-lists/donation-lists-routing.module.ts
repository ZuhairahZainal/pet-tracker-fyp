import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationListsPage } from './donation-lists.page';

const routes: Routes = [
  {
    path: '',
    component: DonationListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationListsPageRoutingModule {}
