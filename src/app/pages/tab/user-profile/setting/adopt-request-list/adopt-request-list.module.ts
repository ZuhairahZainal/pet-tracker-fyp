import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptRequestListPageRoutingModule } from './adopt-request-list-routing.module';

import { AdoptRequestListPage } from './adopt-request-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptRequestListPageRoutingModule
  ],
  declarations: [AdoptRequestListPage]
})
export class AdoptRequestListPageModule {}
