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
    return this.firestore.collection('feed').doc(userId).collection('newsFeed' , ref => ref.orderBy('time', 'desc')).doc<Feed>(timelineId).valueChanges();
  }

   // Donation in user profile
  ownerDonationDetail(donationId: string, userId: string): Observable<Donation> {
    return this.firestore.collection('feed').doc(userId).collection('donation' , ref => ref.orderBy('time', 'desc')).doc<Donation>(donationId).valueChanges();
  }

  // Lost Pet in user profile
  ownerLostPetDetail(lostPetId: string, userId: string): Observable<LostPet> {
    return this.firestore.collection('feed').doc(userId).collection('lostPet' , ref => ref.orderBy('time', 'desc')).doc<LostPet>(lostPetId).valueChanges();
  }

  // Donation for Timeline
  getDonationPost(): Observable<Donation[]> {
    return this.firestore.collection<Donation>(`donationPost`, ref => ref.orderBy('time', 'desc')).valueChanges();  }

  // Feed for Timeline
  getFeedPost(): Observable<Feed[]> {
    return this.firestore.collection<Feed>(`newsFeedPost`, ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  // Lost Pet for Timeline
  getLostPetPost(): Observable<LostPet[]> {
    return this.firestore.collection<LostPet>(`lostPetPost`, ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  // Update Donation Details
  updateDonationDetail(userId, donationId, donationDetail) {
    this.firestore.collection('donationPost').doc(donationId).update(donationDetail)

    this.firestore.collection('feed').doc(userId).collection('donation').doc(donationId).update(donationDetail)
    .then(() => {
      this.router.navigate(['tab/user-profile/donation-details/', donationId]);
    }).catch(error => console.log(error));
  }

  // update Lost Pet Details
  updateLostPetDetail(userId, lostPetId, lostPetDetail) {
    this.firestore.collection('lostPetPost').doc(lostPetId).update(lostPetDetail)

    this.firestore.collection('feed').doc(userId).collection('lostPet').doc(lostPetId).update(lostPetDetail)
    .then(() => {
      this.router.navigate(['tab/user-profile/lostpet-details/', lostPetId]);
    }).catch(error => console.log(error));
  }

  // update News Feed Details
  updateNewsFeedDetail(userId, feedId, feedDetail) {
    this.firestore.collection('newsFeedPost').doc(feedId).update(feedDetail)

    this.firestore.collection('feed').doc(userId).collection('newsFeed').doc(feedId).update(feedDetail)
    .then(() => {
      this.router.navigate(['tab/user-profile/feed-details/', feedId]);
    }).catch(error => console.log(error));
  }
}
