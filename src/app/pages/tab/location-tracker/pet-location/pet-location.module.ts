import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetLocationPageRoutingModule } from './pet-location-routing.module';

import { PetLocationPage } from './pet-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetLocationPageRoutingModule
  ],
  declarations: [PetLocationPage]
})
export class PetLocationPageModule {}
