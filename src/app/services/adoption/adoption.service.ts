import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionsRequest } from 'src/app/models/adoption/adoptions-request';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  constructor(public firestore: AngularFirestore) { }


  // adoption post
  getAdoptionPost(): Observable<AdoptionsDetail[]> {
    return this.firestore.collection<AdoptionsDetail>(`adoptionPost`).valueChanges();
  }

  getAdoptionDetail(adoptionId: string): Observable<AdoptionsDetail> {
    return this.firestore.collection('adoptionPost').doc<AdoptionsDetail>(adoptionId).valueChanges();
  }

  // adoption in user profile
  ownerAdoptionDetail(adoptionId: string, userId: string): Observable<AdoptionsDetail> {
    return this.firestore.collection('adoption').doc(userId).collection('adoptionDetail').doc<AdoptionsDetail>(adoptionId).valueChanges();
  }

  // pending list
  getPendingList(userId: string): Observable<AdoptionsRequest[]> {
    return this.firestore.collection('adoption').doc(userId).collection<AdoptionsRequest>('adoptionRequest').valueChanges();
  }

  getUserPending(userId: string, requestId: string): Observable<AdoptionsRequest> {
    return this.firestore.collection('adoption').doc(userId).collection('adoptionRequest').doc<AdoptionsRequest>(requestId).valueChanges();
  }

}
