import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionRequestPage } from './adoption-request.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionRequestPageRoutingModule {}
