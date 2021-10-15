import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { Pet } from 'src/app/models/pet/pet';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.page.html',
  styleUrls: ['./pet-profile.page.scss'],
})
export class PetProfilePage implements OnInit {

  newReminder;
  public petProfile: Pet;
  public segment: string = "medication";
  userId: string;
  petId: string;

  constructor(private firebaseData: AngularFirestore,
              private activatedRoute: ActivatedRoute){

    this.getUserId();


    this.firebaseData.collection('users').doc(this.userId).collection('newReminder').valueChanges({idField:'reminderId'}).subscribe(
      newReminder =>{
        this.newReminder = newReminder;
      }
     );
  }

  ngOnInit() {
    this.petId = this.activatedRoute.snapshot.paramMap.get('id');

    this.firebaseData.collection('users').doc(this.userId).collection('newPetProfile').doc<Pet>(this.petId).valueChanges().subscribe(
      newPetProfile =>{
        this.petProfile = newPetProfile;
      }
    );
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  deleteReminder(reminderId){
    this.firebaseData.doc(`users/${this.userId}/newReminder/`+ reminderId).delete()
  }

}
