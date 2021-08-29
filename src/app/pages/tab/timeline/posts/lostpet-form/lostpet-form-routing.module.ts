import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostpetFormPage } from './lostpet-form.page';

const routes: Routes = [
  {
    path: '',
    component: LostpetFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostpetFormPageRoutingModule {}
