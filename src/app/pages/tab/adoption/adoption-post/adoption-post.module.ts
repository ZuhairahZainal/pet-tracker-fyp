import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionPostPageRoutingModule } from './adoption-post-routing.module';

import { AdoptionPostPage } from './adoption-post.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    IonicModule,
    AdoptionPostPageRoutingModule
  ],
  declarations: [AdoptionPostPage]
})
export class AdoptionPostPageModule {}
