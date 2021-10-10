import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetPageRoutingModule } from './vet-routing.module';

import { VetPage } from './vet.page';
import { Ng2SearchPipe } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipe,
    VetPageRoutingModule
  ],
  declarations: [VetPage]
})
export class VetPageModule {}
