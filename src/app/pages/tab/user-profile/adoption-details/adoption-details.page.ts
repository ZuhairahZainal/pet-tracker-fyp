import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.page.html',
  styleUrls: ['./adoption-details.page.scss'],
})
export class AdoptionDetailsPage implements OnInit {

  newAdoptionDetail = {
    petAge: '',
    petBreed: '',
    petCategory: '',
    petCondition: '',
    petDescription: '',
    petGender: '',
    petName: '',
    petSpayStatus: '',
  }

  public adoptionsDetail: AdoptionsDetail;
  updateAdoptionForm: FormGroup;
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

    this.updateAdoptionForm = new FormGroup({
      petAge: new FormControl(this.newAdoptionDetail.petAge),
      petName: new FormControl(this.newAdoptionDetail.petName),
      petCategory: new FormControl(this.newAdoptionDetail.petCategory),
      petCondition: new FormControl(this.newAdoptionDetail.petCondition),
      petBreed: new FormControl(this.newAdoptionDetail.petAge),
      petSpayStatus: new FormControl(this.newAdoptionDetail.petSpayStatus),
      petGender: new FormControl(this.newAdoptionDetail.petGender),
      petDescription: new FormControl(this.newAdoptionDetail.petDescription),

    })

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

  updateAdoptionDetail(){
    this.newAdoptionDetail.petName = this.updateAdoptionForm.get('petName').value;
    this.newAdoptionDetail.petAge = this.updateAdoptionForm.get('petAge').value;
    this.newAdoptionDetail.petCategory = this.updateAdoptionForm.get('petCategory').value;
    this.newAdoptionDetail.petDescription = this.updateAdoptionForm.get('petDescription').value;
    this.newAdoptionDetail.petGender = this.updateAdoptionForm.get('petGender').value;
    this.newAdoptionDetail.petSpayStatus = this.updateAdoptionForm.get('petSpayStatus').value;
    this.newAdoptionDetail.petBreed = this.updateAdoptionForm.get('petBreed').value;
    this.newAdoptionDetail.petCondition = this.updateAdoptionForm.get('petConditon').value;

    this.adoptionService.updateAdoptionDetail(this.userId, this.adoptionId, this.newAdoptionDetail);
  }
}
