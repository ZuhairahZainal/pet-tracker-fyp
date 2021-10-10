import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilePage } from './user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'pending-list',
    loadChildren: () => import('./pending-list/pending-list.module').then( m => m.PendingListPageModule)
  },
  {
    path: 'request-user-profile/:requestId',
    loadChildren: () => import('./request-user-profile/request-user-profile.module').then( m => m.RequestUserProfilePageModule)
  },
  {
    path: 'adoption-details/:id',
    loadChildren: () => import('./adoption-details/adoption-details.module').then( m => m.AdoptionDetailsPageModule)
  },
  {
    path: 'feed-details/:id',
    loadChildren: () => import('./feed-details/feed-details.module').then( m => m.FeedDetailsPageModule)
  },
  {
    path: 'donation-details/:id',
    loadChildren: () => import('./donation-details/donation-details.module').then( m => m.DonationDetailsPageModule)
  },
  {
    path: 'lostpet-details/:id',
    loadChildren: () => import('./lostpet-details/lostpet-details.module').then( m => m.LostpetDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfilePageRoutingModule {}
