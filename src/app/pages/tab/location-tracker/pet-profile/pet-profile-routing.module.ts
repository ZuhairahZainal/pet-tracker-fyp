import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetProfilePage } from './pet-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PetProfilePage
  },
  {
    path: 'edit-info/:id',
    loadChildren: () => import('./edit-info/edit-info.module').then( m => m.EditInfoPageModule)
  },
  {
    path: 'add-reminder',
    loadChildren: () => import('./add-reminder/add-reminder.module').then( m => m.AddReminderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetProfilePageRoutingModule {}
