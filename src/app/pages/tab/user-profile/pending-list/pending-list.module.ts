import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingListPageRoutingModule } from './pending-list-routing.module';

import { PendingListPage } from './pending-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingListPageRoutingModule
  ],
  declarations: [PendingListPage]
})
export class PendingListPageModule {}
