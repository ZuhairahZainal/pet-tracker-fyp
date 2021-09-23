import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AdoptionDetails } from '../../shared/adoption-details';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.component.html',
  styleUrls: ['./adoption-details.component.scss'],
})
export class AdoptionDetailsComponent implements OnInit {

  // @Input() public details: AdoptionDetails[];

  adoptionList;

  constructor(private firestore: AngularFirestore,
              private modalCtrl: ModalController) {

                this.firestore.collection('adoptionList').valueChanges({idField: 'petId'}).subscribe(
                  adoptions => {
                    this.adoptionList = adoptions;
                    console.log(this.adoptionList);
                  }
                )
              }

  ngOnInit() {}

  dismiss(): void {
    this.modalCtrl.dismiss();
  }}
