import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptRequestListPage } from './adopt-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptRequestListPageRoutingModule {}
