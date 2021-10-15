import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationTrackerPage } from './location-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: LocationTrackerPage
  },
  {
    path: 'pet-profile/:id',
    loadChildren: () => import('./pet-profile/pet-profile.module').then( m => m.PetProfilePageModule)
  },
  {
    path: 'pet-location',
    loadChildren: () => import('./pet-location/pet-location.module').then( m => m.PetLocationPageModule)
  },
  {
    path: 'manage-device',
    loadChildren: () => import('./manage-device/manage-device.module').then( m => m.ManageDevicePageModule)
  },
  {
    path: 'add-pet',
    loadChildren: () => import('./add-pet/add-pet.module').then( m => m.AddPetPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTrackerPageRoutingModule {}
