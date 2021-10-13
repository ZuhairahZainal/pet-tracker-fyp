import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineChatPage } from './online-chat.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineChatPage
  },
  {
    path: 'convo',
    loadChildren: () => import('./convo/convo.module').then( m => m.ConvoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineChatPageRoutingModule {}
