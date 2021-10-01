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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfilePageRoutingModule {}
