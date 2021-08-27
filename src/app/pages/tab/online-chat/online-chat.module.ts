import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineChatPageRoutingModule } from './online-chat-routing.module';

import { OnlineChatPage } from './online-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineChatPageRoutingModule
  ],
  declarations: [OnlineChatPage]
})
export class OnlineChatPageModule {}
