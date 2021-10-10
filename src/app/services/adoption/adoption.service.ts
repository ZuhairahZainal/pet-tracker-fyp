import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionsRequest } from 'src/app/models/adoption/adoptions-request';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  constructor(public firestore: AngularFirestore,
              private router: Router) {}

  // adoption post
  getAdoptionPost(): Observable<AdoptionsDetail[]> {
    return this.firestore.collection<AdoptionsDetail>(`adoptionPost`, ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  getAdoptionDetail(adoptionId: string): Observable<AdoptionsDetail> {
    return this.firestore.collection('adoptionPost').doc<AdoptionsDetail>(adoptionId).valueChanges();
  }

  // adoption in user profile
  ownerAdoptionDetail(adoptionId: string, userId: string): Observable<AdoptionsDetail> {
    return this.firestore.collection('adoption').doc(userId).collection('adoptionDetail' , ref => ref.orderBy('time', 'desc')).doc<AdoptionsDetail>(adoptionId).valueChanges();
  }

  // Update adoption details
  updateAdoptionDetail(userId, adoptionId, adoptionDetail) {
    this.firestore.collection('adoptionPost').doc(adoptionId).update(adoptionDetail)

    this.firestore.collection('adoption').doc(userId).collection('adoptionDetail').doc(adoptionId).update(adoptionDetail)
    .then(() => {
      this.router.navigate(['tab/user-profile/adoption-details/', adoptionId]);
    }).catch(error => console.log(error));
  }

  // pending list
  getPendingList(userId: string): Observable<AdoptionsRequest[]> {
    return this.firestore.collection('adoption').doc(userId).collection<AdoptionsRequest>('adoptionRequest' , ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  // fetch user profile
  getUserPending(userId: string, requestId: string): Observable<AdoptionsRequest> {
    return this.firestore.collection('adoption').doc(userId).collection('adoptionRequest').doc<AdoptionsRequest>(requestId).valueChanges();
  }

  // adoption application list
  getApplicationList(userId: string): Observable<AdoptionsRequest[]> {
    return this.firestore.collection('adoption').doc(userId).collection<AdoptionsRequest>('adoptionApplication', ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  fetchOwnerProfile(userId: string, requestId): Observable<AdoptionsRequest>{
    return this.firestore.collection('adoption').doc(userId).collection('adoptionApplication').doc<AdoptionsRequest>(requestId).valueChanges();
  }
}
