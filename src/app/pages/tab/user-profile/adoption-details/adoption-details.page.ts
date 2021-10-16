import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
// import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.page.html',
  styleUrls: ['./adoption-details.page.scss'],
})
export class AdoptionDetailsPage implements OnInit {

  public adoptionsDetail: AdoptionsDetail;
  adoptionId: string;
  userId: string;
  adoptionList;

  constructor(private firestore: AngularFirestore,
              private adoptionService: AdoptionService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.adoptionId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.adoptionService.ownerAdoptionDetail(this.adoptionId, this.userId).subscribe(adoptionDetail => {
      this.adoptionsDetail = adoptionDetail;
    });

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async deleteAdoptionPost(adoptionId: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removePost(adoptionId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  removePost(adoptionId: string){
    this.firestore.doc('adoptionPost/' + adoptionId).delete();
    this.firestore.collection('adoption').doc(this.userId).collection('adoptionDetail').doc(adoptionId).delete().then(() => {
      this.router.navigate(['tab/user-profile']);
    })
  }
}
