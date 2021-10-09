import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

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

  constructor(private adoptionService: AdoptionService,
              private activatedRoute: ActivatedRoute) {
              }

  ngOnInit() {
    const adoptionId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.adoptionId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.adoptionService.ownerAdoptionDetail(adoptionId, this.userId).subscribe(adoptionDetail => {
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

  updateAdoptionDetail(): void{
    this.newAdoptionDetail.petName = this.updateAdoptionForm.get('petName').value;
    this.newAdoptionDetail.petAge = this.updateAdoptionForm.get('petAge').value;
    this.newAdoptionDetail.petCategory = this.updateAdoptionForm.get('petCategory').value;
    this.newAdoptionDetail.petDescription = this.updateAdoptionForm.get('petDescription').value;
    this.newAdoptionDetail.petGender = this.updateAdoptionForm.get('petGender').value;
    this.newAdoptionDetail.petSpayStatus = this.updateAdoptionForm.get('petSpayStatus').value;
    this.newAdoptionDetail.petBreed = this.updateAdoptionForm.get('petBreed').value;
    this.newAdoptionDetail.petCondition = this.updateAdoptionForm.get('petCondition').value;

    this.adoptionService.updateAdoptionDetail(this.userId, this.adoptionId, this.newAdoptionDetail);
  }
}
