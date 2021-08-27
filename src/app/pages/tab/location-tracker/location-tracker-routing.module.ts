import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationTrackerPage } from './location-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: LocationTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTrackerPageRoutingModule {}
