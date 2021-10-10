import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LostPet } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-lostpet-details',
  templateUrl: './lostpet-details.page.html',
  styleUrls: ['./lostpet-details.page.scss'],
})
export class LostpetDetailsPage implements OnInit {

  public lostPetDetail: LostPet;
  lostPetId: string;
  userId: string;

  constructor(private firestore: AngularFirestore,
              private timelineService: TimelineService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}


  ngOnInit() {
    this.lostPetId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerLostPetDetail(this.lostPetId, this.userId).subscribe(lostPetDetail => {
      this.lostPetDetail = lostPetDetail;
    });

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async deleteDonationPost(lostPetId: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removePost(lostPetId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  removePost(lostPetId: string){
    this.firestore.doc('feedPost/' + lostPetId).delete();
    this.firestore.collection('feed').doc(this.userId).collection('timeline').doc(lostPetId).delete().then(() => {
      this.router.navigate(['tab/user-profile']);
    })
  }


}
