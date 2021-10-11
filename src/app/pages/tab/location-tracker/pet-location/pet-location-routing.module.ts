import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetLocationPage } from './pet-location.page';

const routes: Routes = [
  {
    path: '',
    component: PetLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetLocationPageRoutingModule {}
