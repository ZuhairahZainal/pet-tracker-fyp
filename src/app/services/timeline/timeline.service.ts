import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Donation, Feed, LostPet } from 'src/app/models/timeline/timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(public firestore: AngularFirestore,
              private router: Router) {}


  // Feed in user profile
  ownerFeedDetail(timelineId: string, userId: string): Observable<Feed> {
    return this.firestore.collection('feed').doc(userId).collection('timeline' , ref => ref.orderBy('createdAt', 'asc')).doc<Feed>(timelineId).valueChanges();
  }

   // Donation in user profile
  ownerDonationDetail(donationId: string, userId: string): Observable<Donation> {
    return this.firestore.collection('feed').doc(userId).collection('lostPet' , ref => ref.orderBy('createdAt', 'asc')).doc<Donation>(donationId).valueChanges();
  }

  // Lost Pet in user profile
  ownerLostPetDetail(lostPetId: string, userId: string): Observable<LostPet> {
    return this.firestore.collection('feed').doc(userId).collection('donation' , ref => ref.orderBy('createdAt', 'asc')).doc<LostPet>(lostPetId).valueChanges();
  }
}
