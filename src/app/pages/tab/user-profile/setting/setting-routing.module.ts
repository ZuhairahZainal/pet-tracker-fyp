import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingPage } from './setting.page';

const routes: Routes = [
  {
    path: '',
    component: SettingPage
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'liked-post',
    loadChildren: () => import('./liked-post/liked-post.module').then( m => m.LikedPostPageModule)
  },
  {
    path: 'personal-info',
    loadChildren: () => import('./personal-info/personal-info.module').then( m => m.PersonalInfoPageModule)
  },
  {
    path: 'preference',
    loadChildren: () => import('./preference/preference.module').then( m => m.PreferencePageModule)
  },
  {
    path: 'security',
    loadChildren: () => import('./security/security.module').then( m => m.SecurityPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingPageRoutingModule {}
