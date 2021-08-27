import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationTrackerPageRoutingModule } from './location-tracker-routing.module';

import { LocationTrackerPage } from './location-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationTrackerPageRoutingModule
  ],
  declarations: [LocationTrackerPage]
})
export class LocationTrackerPageModule {}
