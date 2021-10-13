import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDevicePageRoutingModule } from './edit-device-routing.module';

import { EditDevicePage } from './edit-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditDevicePageRoutingModule
  ],
  declarations: [EditDevicePage]
})
export class EditDevicePageModule {}
