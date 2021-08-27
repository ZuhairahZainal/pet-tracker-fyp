import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    component: TabPage,
    children:[
      {
        path: 'timeline',
        loadChildren: () => import('./timeline/timeline.module').then( m => m.TimelinePageModule)
      },
      {
        path: 'adoption',
        loadChildren: () => import('./adoption/adoption.module').then( m => m.AdoptionPageModule)
      },
      {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
      },
      {
        path: 'location-tracker',
        loadChildren: () => import('./location-tracker/location-tracker.module').then( m => m.LocationTrackerPageModule)
      },
      {
        path: 'online-chat',
        loadChildren: () => import('./online-chat/online-chat.module').then( m => m.OnlineChatPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
