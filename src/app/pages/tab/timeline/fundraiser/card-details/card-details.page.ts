import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {

cardDetails = {
  donationId: '',
  cardId: '',
  userId: '',
  firstName: '',
  lastName: '',
  creditCardNumber: '',
  cvv: '',
  date: new Date().toDateString(),
  expiration: new Date().toDateString,
  amount: null,
}

cardDetailsForm: FormGroup;
userId: any;
donationId: string;

constructor(private firestore: AngularFirestore,
            public loadingCtrl: LoadingController,
            public alertCtrl: AlertController,
            private activatedRoute: ActivatedRoute,
            private router: Router) { }

  ngOnInit() {
    this.getUserId()

    this.donationId = this.activatedRoute.snapshot.paramMap.get('id');

    this.cardDetailsForm = new FormGroup({
      firstName: new FormControl(this.cardDetails.firstName,[
        Validators.required
      ]),
      lastName: new FormControl (this.cardDetails.lastName,[
        Validators.required
      ]),
      creditCardNumber: new FormControl (this.cardDetails.creditCardNumber,[
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)
      ]),
      cvv: new FormControl (this.cardDetails.cvv,[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]),
      expiration: new FormControl (this.cardDetails.expiration,[
        Validators.required
      ]),
      amount: new FormControl (this.cardDetails.amount,[
        Validators.required
      ]),

     });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.cardDetails.userId = `${user.uid}`;
    this.userId = user.uid;
  }

  async newCard(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.cardDetails.cardId = this.firestore.createId();
    this.cardDetails.firstName = this.cardDetailsForm.get('firstName').value;
    this.cardDetails.lastName = this.cardDetailsForm.get('lastName').value;
    this.cardDetails.creditCardNumber = this.cardDetailsForm.get('creditCardNumber').value;
    this.cardDetails.cvv = this.cardDetailsForm.get('cvv').value;
    this.cardDetails.expiration = this.cardDetailsForm.get('expiration').value;
    this.cardDetails.amount = Number(this.cardDetailsForm.get('amount').value);
    this.cardDetails.donationId = this.donationId;

    this.firestore.collection('fundraiser').doc(this.donationId).collection('donorList').doc(this.cardDetails.cardId).set(this.cardDetails)

      this.firestore.collection('users').doc(this.cardDetails.userId)
      .collection('fundraiser').doc(this.cardDetails.cardId).set(this.cardDetails)

      .then( async success => {
        loading.dismiss().then( async success => {
          let alert = await this.alertCtrl.create({
            header: 'Donation Successful!',
            message: 'Thank You For Your Kindness.',
            buttons: [{
            text: 'OK',
           handler: () => {
          this.router.navigate(['/tab/timeline/fundraiser/', this.donationId]);
              }
           }]
         });
          alert.present();

        });
      },
        error => {
          loading.dismiss().then(() => {
            console.error(error);
          });
        }
      );

  }


}
