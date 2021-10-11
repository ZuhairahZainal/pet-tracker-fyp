import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageDevicePageRoutingModule } from './manage-device-routing.module';

import { ManageDevicePage } from './manage-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageDevicePageRoutingModule
  ],
  declarations: [ManageDevicePage]
})
export class ManageDevicePageModule {}
