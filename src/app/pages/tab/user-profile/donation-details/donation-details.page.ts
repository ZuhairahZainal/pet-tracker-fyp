import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Donation } from 'src/app/models/timeline/timeline';
import firebase from 'firebase/app';
import { TimelineService } from 'src/app/services/timeline/timeline.service';


@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.page.html',
  styleUrls: ['./donation-details.page.scss'],
})
export class DonationDetailsPage implements OnInit {

  public donationDetail: Donation;
  donationId: string;
  userId: string;

  constructor(private firestore: AngularFirestore,
              private timelineService: TimelineService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}


  ngOnInit() {
    this.donationId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerDonationDetail(this.donationId, this.userId).subscribe(donationDetails => {
      this.donationDetail = donationDetails;
    });

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async deleteDonationPost(donationId: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removePost(donationId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  removePost(donationId: string){
    this.firestore.doc('donationPost/' + donationId).delete();
    this.firestore.collection('feed').doc(this.userId).collection('donation').doc(donationId).delete().then(() => {
      this.router.navigate(['tab/user-profile']);
    })
  }

}
