import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTimelineProfilePage } from './user-timeline-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserTimelineProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTimelineProfilePageRoutingModule {}
