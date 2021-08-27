import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LikedPostPageRoutingModule } from './liked-post-routing.module';

import { LikedPostPage } from './liked-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LikedPostPageRoutingModule
  ],
  declarations: [LikedPostPage]
})
export class LikedPostPageModule {}
