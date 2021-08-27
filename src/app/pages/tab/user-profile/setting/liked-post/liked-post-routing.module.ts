import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LikedPostPage } from './liked-post.page';

const routes: Routes = [
  {
    path: '',
    component: LikedPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LikedPostPageRoutingModule {}
