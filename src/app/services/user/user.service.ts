import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUsername: any;
  userFirstName: any;
  userLastName: any;
  userDOB: any;
  userPhone: any;
  userEmail: any;
  userId: any;

  constructor(private firestore: AngularFirestore) {}

    setUserId(){
      let user = firebase.auth().currentUser;
      this.userId = user.uid;
    }

    getUserDetails(){
      this.setUserId();
      return this.firestore.doc(`/users/${this.userId}`).valueChanges();
    }

}

