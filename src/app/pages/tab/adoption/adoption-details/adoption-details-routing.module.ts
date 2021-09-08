import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionDetailsPage } from './adoption-details.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionDetailsPageRoutingModule {}
