import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageDevicePage } from './manage-device.page';

const routes: Routes = [
  {
    path: '',
    component: ManageDevicePage
  },
  {
    path: 'add-device',
    loadChildren: () => import('./add-device/add-device.module').then( m => m.AddDevicePageModule)
  },
  {
    path: 'edit-device/:id',
    loadChildren: () => import('./edit-device/edit-device.module').then( m => m.EditDevicePageModule)
  },
  {
    path: 'qr-code',
    loadChildren: () => import('./qr-code/qr-code.module').then( m => m.QrCodePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageDevicePageRoutingModule {}
