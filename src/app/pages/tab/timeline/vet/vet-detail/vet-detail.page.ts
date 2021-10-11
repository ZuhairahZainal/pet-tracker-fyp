import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vet } from 'src/app/models/vet/vet';
import { VetService } from 'src/app/services/vet/vet.service';
import firebase from 'firebase/app';

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
              private activatedRoute: ActivatedRoute) {}


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

}
