import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vet } from 'src/app/models/vet/vet';
import { VetService } from 'src/app/services/vet/vet.service';
import firebase from 'firebase/app';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-vet-detail',
  templateUrl: './vet-detail.page.html',
  styleUrls: ['./vet-detail.page.scss'],
})
export class VetDetailPage implements OnInit {

  public vetDetail: Vet;
  vetId: string;
  userId: string;

  constructor(private vetService: VetService,
              private activatedRoute: ActivatedRoute,
              private alertCtrl: AlertController,
              private router: Router,
              private callNumber: CallNumber) {}


  ngOnInit() {

    this.vetId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.vetService.getVetDetail(this.vetId).subscribe(vetDetails => {
      this.vetDetail = vetDetails;
    });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async callVet(n: number, vet:string){
    const alert = await this.alertCtrl.create({
      header: `Call ${vet}`,
      message: `Do you want to contact ${vet}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => this.launchDialer(n),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();

  }


  launchDialer(n: number){
    this.callNumber.callNumber(n.toString(), true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

}
