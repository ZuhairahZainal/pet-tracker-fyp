import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionDetailsPageRoutingModule } from './adoption-details-routing.module';

import { AdoptionDetailsPage } from './adoption-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptionDetailsPageRoutingModule
  ],
  declarations: [AdoptionDetailsPage]
})
export class AdoptionDetailsPageModule {}
