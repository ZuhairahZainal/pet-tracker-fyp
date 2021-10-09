import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import firebase from 'firebase/app';

@Component({
  selector: 'app-adoption-request',
  templateUrl: './adoption-request.page.html',
  styleUrls: ['./adoption-request.page.scss'],
})
export class AdoptionRequestPage implements OnInit {

  newAdoptionRequest={
    requestId: '',
    userId: '',
    petId: '',
    userName: '',
    petName: '',
    petOwner: '',
    requestDescription: '',
    createdAt: new Date().toDateString(),
    status: 'Pending'
  }

  requestNotif={
    category: 'Adoption Request',
    petName: '',
    userName: '',
    createdAt: new Date().toDateString()
  }

  newRequestForm: FormGroup;
  petId: string;
  userId: string;
  requestId: string;

  constructor(private firestore: AngularFirestore,
              private router: Router,
              public loadingCtrl: LoadingController,
              private activatedRoute: ActivatedRoute) {
    this.petId = this.activatedRoute.snapshot.paramMap.get('petId');

    this.getPetData(this.petId).subscribe( adoptionList => {
        this.petId = adoptionList['petId'];
        this.newAdoptionRequest.petId = adoptionList['petId'];
        this.newAdoptionRequest.petName = adoptionList['petName'];
        this.newAdoptionRequest.petOwner= adoptionList['userId'];
        this.requestNotif.petName = adoptionList['petName'];
    });

    let user = firebase.auth().currentUser;
    this.userId = user.uid;

    this.newAdoptionRequest.userId = `${user.uid}`;

    this.firestore.doc(`/users/${this.userId}`).valueChanges().subscribe( userProfile => {
      this.newAdoptionRequest.userName = userProfile['name'];
      this.requestNotif.userName = userProfile['name'];
    }
    );
  }

  ngOnInit() {
    this.newRequestForm = new FormGroup({
      requestDescription: new FormControl(this.newAdoptionRequest.requestDescription, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  async sendRequest(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    const userRef = this.firestore.collection('adoptionPost').doc(this.newAdoptionRequest.petId);
    const userRef1 = this.firestore.collection('adoption').doc(this.newAdoptionRequest.petOwner)
    .collection('adoptionDetail').doc(this.newAdoptionRequest.petId);

    const increment = firebase.firestore.FieldValue.increment(1);

    userRef.update({ adoptCount: increment });
    userRef1.update({ adoptCount: increment });

    this.newAdoptionRequest.requestId = this.firestore.createId();
    this.newAdoptionRequest.requestDescription = this.newRequestForm.get('requestDescription').value;

    this.firestore.collection('users').doc(this.newAdoptionRequest.petOwner).collection('notification').add(this.requestNotif);

    this.firestore.collection('adoption').doc(this.newAdoptionRequest.userId).collection('adoptionApplication').doc(this.newAdoptionRequest.requestId).set(
      this.newAdoptionRequest);

    this.firestore.collection('adoption').doc(this.newAdoptionRequest.petOwner).collection('adoptionRequest').doc(this.newAdoptionRequest.requestId).set(
     this.newAdoptionRequest).then(() => {
      loading.dismiss().then(() => {
        this.newRequestForm = null;
        this.router.navigate(['/tab/adoption/adoption-details', this.petId]);
      });
    },
    error => {
      loading.dismiss().then(() => {
        console.error(error);
      });
    });
  }

  getUserDetail(userId){
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  getPetData(petId) {
    return this.firestore.collection('adoptionPost').doc(petId).valueChanges({idField: 'petId'});
  }
}
