import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostpetFormPageRoutingModule } from './lostpet-form-routing.module';

import { LostpetFormPage } from './lostpet-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostpetFormPageRoutingModule
  ],
  declarations: [LostpetFormPage]
})
export class LostpetFormPageModule {}
