import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Fav } from 'src/app/models/fav/fav';

@Injectable({
  providedIn: 'root'
})
export class FavService {

  constructor(public firestore: AngularFirestore) {}

  getUserPinned(userId: string): Observable<Fav[]>{
    return this.firestore.collection('users').doc(userId).collection<Fav>('fav-posts', ref => ref.orderBy('timeAdded', 'desc')).valueChanges();
  }
}
