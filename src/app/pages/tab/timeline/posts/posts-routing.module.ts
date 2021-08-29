import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsPage } from './posts.page';

const routes: Routes = [
  {
    path: '',
    component: PostsPage
  },
  {
    path: 'donate-form',
    loadChildren: () => import('./donate-form/donate-form.module').then( m => m.DonateFormPageModule)
  },
  {
    path: 'lostpet-form',
    loadChildren: () => import('./lostpet-form/lostpet-form.module').then( m => m.LostpetFormPageModule)
  },
  {
    path: 'newpost-form',
    loadChildren: () => import('./newpost-form/newpost-form.module').then( m => m.NewpostFormPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsPageRoutingModule {}
