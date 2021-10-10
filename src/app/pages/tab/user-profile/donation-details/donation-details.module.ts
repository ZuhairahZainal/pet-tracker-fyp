import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationDetailsPageRoutingModule } from './donation-details-routing.module';

import { DonationDetailsPage } from './donation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonationDetailsPageRoutingModule
  ],
  declarations: [DonationDetailsPage]
})
export class DonationDetailsPageModule {}
