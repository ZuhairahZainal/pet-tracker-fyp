import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateFormPageRoutingModule } from './donate-form-routing.module';

import { DonateFormPage } from './donate-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DonateFormPageRoutingModule
  ],
  declarations: [DonateFormPage]
})
export class DonateFormPageModule {}
