import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestUserProfilePage } from './request-user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: RequestUserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestUserProfilePageRoutingModule {}
