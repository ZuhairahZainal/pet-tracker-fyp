import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationListsPageRoutingModule } from './donation-lists-routing.module';

import { DonationListsPage } from './donation-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonationListsPageRoutingModule
  ],
  declarations: [DonationListsPage]
})
export class DonationListsPageModule {}
