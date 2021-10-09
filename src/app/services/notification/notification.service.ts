import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { RequestRequest } from 'src/app/models/notification/request-request';
import { RequestResult } from 'src/app/models/notification/request-result';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public firestore: AngularFirestore) { }

    // adoption result
    getAdoptionResults(userId: string): Observable<RequestResult[]> {
      return this.firestore.collection('notification').doc(userId).collection<RequestResult>(`adoptionResults`).valueChanges();
    }

    // adoption request
    getAdoptionRequest(userId: string): Observable<RequestRequest[]> {
      return this.firestore.collection('notification').doc(userId).collection<RequestRequest>(`adoptionRequest`).valueChanges();
    }

    getNotification(userId: string){
      return this.firestore.collection('users').doc(userId).collection('notification', ref => ref.orderBy('createdAt', 'desc')).valueChanges();
    }
}
