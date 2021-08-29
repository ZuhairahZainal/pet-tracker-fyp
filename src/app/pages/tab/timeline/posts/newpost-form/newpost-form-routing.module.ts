import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewpostFormPage } from './newpost-form.page';

const routes: Routes = [
  {
    path: '',
    component: NewpostFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewpostFormPageRoutingModule {}
