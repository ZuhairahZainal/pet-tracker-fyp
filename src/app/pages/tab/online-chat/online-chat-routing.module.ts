import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineChatPage } from './online-chat.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineChatPageRoutingModule {}
