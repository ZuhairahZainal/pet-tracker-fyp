import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.page.html',
  styleUrls: ['./pet-profile.page.scss'],
})
export class PetProfilePage implements OnInit {

  newReminder;
  public segment: string = "medication";
  userId: string;

  constructor(private firebaseData: AngularFirestore){

    this.getUserId();

    this.firebaseData.collection('users').doc(this.userId).collection('newReminder').valueChanges({idField:'reminderId'}).subscribe(
      newReminder =>{
        this.newReminder = newReminder;
        console.log(newReminder);
      }
     );
  }

  ngOnInit() {
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
