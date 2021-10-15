import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardDetail } from 'src/app/models/checkout/checkout';
import { FundraiserService } from 'src/app/services/fundraiser/fundraiser.service';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser.page.html',
  styleUrls: ['./fundraiser.page.scss'],
})
export class FundraiserPage implements OnInit {

  public cardDetail: Observable<CardDetail[]>;
  donationId: string;
  donationTitle: string;
  donationType: string;
  donationDate: string;

  constructor(private fundraiserService: FundraiserService,
              private alertCtrl: AlertController,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore,
              private router: Router) { }
  userId: string;

  ngOnInit() {
    this.getUserId();

    this.donationId = this.activatedRoute.snapshot.paramMap.get('id');

    this.cardDetail = this.fundraiserService.getCardDetail(this.userId);

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async deleteCard(id: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removeCard(id),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  removeCard(id: string){
    this.firestore.collection('users').doc(this.userId).collection('fundraiser').doc(id).delete();
  }

  async proceed(){
    let alert = await this.alertCtrl.create({
      header: 'Thank You!',
      message: 'Thank You For Your Kindness.',
      buttons: [{
      text: 'OK',
     handler: () => {
      this.router.navigate(['/tab/timeline']);
        }
     }]
   });
    alert.present();
  }

}

