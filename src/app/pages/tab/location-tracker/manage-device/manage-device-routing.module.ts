import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageDevicePage } from './manage-device.page';

const routes: Routes = [
  {
    path: '',
    component: ManageDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageDevicePageRoutingModule {}
