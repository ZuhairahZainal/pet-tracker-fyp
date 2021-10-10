import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostpetDetailsPageRoutingModule } from './lostpet-details-routing.module';

import { LostpetDetailsPage } from './lostpet-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostpetDetailsPageRoutingModule
  ],
  declarations: [LostpetDetailsPage]
})
export class LostpetDetailsPageModule {}
