import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDevicePageRoutingModule } from './add-device-routing.module';

import { AddDevicePage } from './add-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddDevicePageRoutingModule
  ],
  declarations: [AddDevicePage]
})
export class AddDevicePageModule {}
