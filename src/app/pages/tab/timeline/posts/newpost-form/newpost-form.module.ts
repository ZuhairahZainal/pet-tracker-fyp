import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewpostFormPageRoutingModule } from './newpost-form-routing.module';

import { NewpostFormPage } from './newpost-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewpostFormPageRoutingModule
  ],
  declarations: [NewpostFormPage]
})
export class NewpostFormPageModule {}
