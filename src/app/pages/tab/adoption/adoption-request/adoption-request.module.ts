import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionRequestPageRoutingModule } from './adoption-request-routing.module';

import { AdoptionRequestPage } from './adoption-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdoptionRequestPageRoutingModule
  ],
  declarations: [AdoptionRequestPage]
})
export class AdoptionRequestPageModule {}
