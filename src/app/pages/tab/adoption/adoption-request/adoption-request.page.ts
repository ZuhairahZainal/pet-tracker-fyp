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
    requestName: '',
    requestDescription: ''
  }

  requestNotif={
    petName: '',
    userName: '',
    message: 'request to adopt'
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
      requestName: new FormControl(this.newAdoptionRequest.requestName, [
        Validators.required,
        Validators.minLength(2),
      ]),
      requestDescription: new FormControl(this.newAdoptionRequest.requestDescription, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  async sendRequest(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newAdoptionRequest.requestId = this.firestore.createId();
    this.newAdoptionRequest.requestName = this.newRequestForm.get('requestName').value;
    this.newAdoptionRequest.requestDescription = this.newRequestForm.get('requestDescription').value;

    this.firestore.collection('notification').doc(this.newAdoptionRequest.petOwner).collection('adoptionRequest').doc(this.newAdoptionRequest.requestId).set(this.requestNotif);

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
