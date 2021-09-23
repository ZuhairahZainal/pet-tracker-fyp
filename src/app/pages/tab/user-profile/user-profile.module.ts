import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';

import { AdoptionDetailsComponent } from './components/adoption-Details/adoption-Details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule
  ],
  declarations: [UserProfilePage, AdoptionDetailsComponent]
})
export class UserProfilePageModule {}
