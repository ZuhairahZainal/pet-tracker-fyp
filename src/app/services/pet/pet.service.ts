import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Device } from 'src/app/models/pet/pet';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(public firestore: AngularFirestore) { }

  //Add the device
  addDevice(userId: string, deviceId:string, device: Device){
    return this.firestore.collection('users').doc(userId).collection('devices').doc(deviceId).set({...device});
  }

  //Display a single only device
  getDevice(userId: string, id: string): Observable<Device>
  {
    return this.firestore.collection('users').doc(userId).collection('devices').doc<Device>(id)
    .snapshotChanges()
    .pipe(
      map(a =>{
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const id = a.payload.id;
        const data = a.payload.data();
        return { id, ...data};
      })
    );
  }

  //Display the list of device
  getDevices(userId: string): Observable<Device[]>{
  return this.firestore.collection('users').doc(userId).collection<Device>('devices', ref => ref.orderBy('time', 'asc') ).snapshotChanges()
  .pipe(
    map(actions => actions.map(a =>{
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return {id, ...data};
      }))
  );

  }
  // Update the Device
  updateDevice(userId:string, id: string, device: Device): Promise<void>{
    return this.firestore.collection('users').doc(userId).collection('devices').doc<Device>(id).update(device);
  }
  //Delete the Device
  deleteDevice(userId: string, id: string): Promise<void>{
    return this.firestore.collection('users').doc(userId).collection('devices').doc(id).delete();
  }

}
