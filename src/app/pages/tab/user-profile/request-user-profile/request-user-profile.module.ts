import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestUserProfilePageRoutingModule } from './request-user-profile-routing.module';

import { RequestUserProfilePage } from './request-user-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestUserProfilePageRoutingModule
  ],
  declarations: [RequestUserProfilePage]
})
export class RequestUserProfilePageModule {}
