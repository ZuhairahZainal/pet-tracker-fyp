import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FundraiserPageRoutingModule } from './fundraiser-routing.module';

import { FundraiserPage } from './fundraiser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FundraiserPageRoutingModule
  ],
  declarations: [FundraiserPage]
})
export class FundraiserPageModule {}
