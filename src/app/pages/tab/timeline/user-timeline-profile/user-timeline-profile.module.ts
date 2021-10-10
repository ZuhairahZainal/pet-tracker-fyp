import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTimelineProfilePageRoutingModule } from './user-timeline-profile-routing.module';

import { UserTimelineProfilePage } from './user-timeline-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTimelineProfilePageRoutingModule
  ],
  declarations: [UserTimelineProfilePage]
})
export class UserTimelineProfilePageModule {}
