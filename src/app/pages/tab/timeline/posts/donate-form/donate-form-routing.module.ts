import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateFormPage } from './donate-form.page';

const routes: Routes = [
  {
    path: '',
    component: DonateFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonateFormPageRoutingModule {}
