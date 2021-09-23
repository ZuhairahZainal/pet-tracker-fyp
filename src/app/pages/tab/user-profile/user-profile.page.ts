import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AdoptionDetailsComponent } from './components/adoption-Details/adoption-Details.component';
import { AdoptionDetails } from './shared/adoption-details';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  adoptionList;
  public segment: string = "allpost";

  private adoptionDetail: AdoptionDetails[];

  constructor(private firestore: AngularFirestore,
              private modalCtrl: ModalController) {


    this.firestore.collection('adoptionList').valueChanges({idField: 'petId'}).subscribe(
      adoptions => {
        this.adoptionList = adoptions;
        console.log(this.adoptionList);
      }
    )
  }

  ngOnInit() {
    this.getAdoptionList().valueChanges().subscribe( (details: any) => {
      this.adoptionDetail = details;
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getAdoptionList() {
    return this.firestore.collection('adoptionList');
  }

  async displayAdoptionDetails(): Promise<void> {
    const adoptionDetailModal = await this.modalCtrl.create({
      component: AdoptionDetailsComponent,
      componentProps: { accounts: this.adoptionDetail },
    });
    return await adoptionDetailModal.present();
  }


}
