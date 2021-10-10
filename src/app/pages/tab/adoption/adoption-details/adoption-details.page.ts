import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.page.html',
  styleUrls: ['./adoption-details.page.scss'],
})
export class AdoptionDetailsPage implements OnInit {

  public adoptionsDetail: AdoptionsDetail;
  filter: string;
  petId: any;
  adopt: number = 0;

  constructor(private firestore: AngularFirestore,
              private adoptionService: AdoptionService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const adoptionId: string = this.activatedRoute.snapshot.paramMap.get('id');

    this.adoptionService.getAdoptionDetail(adoptionId).subscribe(adoptionDetail => {
      this.adoptionsDetail = adoptionDetail;
    });
  }

}
