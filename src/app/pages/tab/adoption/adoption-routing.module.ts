import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionPage } from './adoption.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'adoption-post',
    component: AdoptionPage
  },
  {
    path: 'adoption-form',
    loadChildren: () => import('./adoption-form/adoption-form.module').then( m => m.AdoptionFormPageModule)
  },
  {
    path: 'adoption-request',
    loadChildren: () => import('./adoption-request/adoption-request.module').then( m => m.AdoptionRequestPageModule)
  },
  {
    path: 'adoption-details/:petId',
    loadChildren: () => import('./adoption-details/adoption-details.module').then( m => m.AdoptionDetailsPageModule)
  },
  {
    path: 'adoption-post',
    loadChildren: () => import('./adoption-post/adoption-post.module').then( m => m.AdoptionPostPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionPageRoutingModule {}
