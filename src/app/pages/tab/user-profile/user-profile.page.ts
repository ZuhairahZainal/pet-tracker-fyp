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
  public segment: string = "allpost";
  currentUser: string;

  // for user profile detail
  userId: any;
  userUsername: any;
  userBio: any;
  userImage: any;

  //for adoption post
  adoptionId: any;
  postOwnerId: any;
  petAdoptName: any;
  petAdoptAge: any;
  petAdoptBreed: any;
  petAdoptCategory: any;
  petAdoptCondition: any;
  petAdoptDescription: any;
  petAdoptGender: any;
  petAdoptSpayStatus: any;
  petAdoptImage: any;
  petAdoptMedicalRecord: any;

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
