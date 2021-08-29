import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimelinePage } from './timeline.page';

const routes: Routes = [
  {
    path: '',
    component: TimelinePage
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then( m => m.PostsPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimelinePageRoutingModule {}
