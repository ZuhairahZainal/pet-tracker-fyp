import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Device } from 'src/app/models/pet/pet';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(public firestore: AngularFirestore) { }

  // get pet device
  getPetDevice(userId: string):Observable<Device[]>{
    return this.firestore.collection('users').doc(userId).collection<Device>(`devices`).valueChanges();
  }
}
