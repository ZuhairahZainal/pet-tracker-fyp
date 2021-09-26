import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  adoptionList;
  public segment: string = "allpost";

  // for user profile detail
  userId: any;
  userUsername: any;

  //for adoption post
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
                    this.userId = profile['userId'];
                  }
                )

                this.firestore.collection('adoptionList').valueChanges({idField: 'petId'}).subscribe(
                  adoptions => {
                    this.adoptionList = adoptions;
                    this.postOwnerId = adoptions['userId'];
                    this.petAdoptName = adoptions['petName'];
                    this.petAdoptAge = adoptions['petAge'];
                    this.petAdoptBreed = adoptions['petBreed'];
                    this.petAdoptCategory = adoptions['petCategory'];
                    this.petAdoptCondition = adoptions['petCondition'];
                    this.petAdoptDescription = adoptions['petDescription'];
                    this.petAdoptGender = adoptions['petGender'];
                    this.petAdoptSpayStatus = adoptions['petSpayStatus'];
                    this.petAdoptImage = adoptions['petImage'];
                    this.petAdoptMedicalRecord = adoptions['petMedicalRecord'];
                  }
                )

  }

  ngOnInit() {
  }

  displayAdoptionPost(){
    if(this.postOwnerId = this.userId){
      this.firestore.collection('adoptionList')

    }
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getAdoptionList() {
    return this.firestore.collection('adoptionList');
  }

}
