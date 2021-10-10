import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../../../services/user/user.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  adoptionList;
  feedList;
  donationList;
  lostPetList;

  public segment: string = "feed";
  currentUser: string;

  // for user profile detail
  userId: any;
  userUsername: any;
  userBio: any;
  userImage: any;

  constructor(private firestore: AngularFirestore,
              private userService: UserService) {

                this.userService.getUserDetails().subscribe(
                  profile => {
                    this.userUsername = profile['name'];
                    this.userImage = profile['userImage'];
                    this.userBio = profile['userBio'];
                    this.userId = profile['userId'];
                  }
                )

                this.getUserId()

                this.firestore.collection('adoption').doc(this.currentUser).collection('adoptionDetail').valueChanges({idField: 'petId'}).subscribe(
                  adoptions => {
                    this.adoptionList = adoptions;
                })

                this.firestore.collection('feed').doc(this.currentUser).collection('donation', ref => ref.orderBy('time', 'desc')).valueChanges({idField: 'donationId'}).subscribe(
                  donations => {
                    this.donationList = donations;
                })

                this.firestore.collection('feed').doc(this.currentUser).collection('lostPet', ref => ref.orderBy('time', 'desc')).valueChanges({idField: 'lostPetId'}).subscribe(
                  lostpets => {
                    this.lostPetList = lostpets;
                })

                this.firestore.collection('feed').doc(this.currentUser).collection('newsFeed', ref => ref.orderBy('time', 'desc')).valueChanges({idField: 'newsFeedId'}).subscribe(
                  feeds => {
                    this.feedList = feeds;
                })

  }


  ngOnInit() {

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.currentUser = user.uid;

  }


  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getAdoptionList() {
    return this.firestore.collection('adoptionList');
  }

}
