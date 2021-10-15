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
  },
  {
    path: 'user-timeline-profile',
    loadChildren: () => import('./user-timeline-profile/user-timeline-profile.module').then( m => m.UserTimelineProfilePageModule)
  },
  {
    path: 'vet',
    loadChildren: () => import('./vet/vet.module').then( m => m.VetPageModule)
  },
  {
    path: 'fundraiser/:id',
    loadChildren: () => import('./fundraiser/fundraiser.module').then( m => m.FundraiserPageModule)
  },
  {
    path: 'comment/:id',
    loadChildren: () => import('./comment/comment.module').then( m => m.CommentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimelinePageRoutingModule {}
