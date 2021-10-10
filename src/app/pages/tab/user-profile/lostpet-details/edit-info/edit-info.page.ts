import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LostPet } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  newLostPetDetail = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    userImage: '',
    userName: '',
    petName: '',
    petGender: '',
    petBreed: '',
    petColor: '',
    lastLocation: '',
    reward: '',
    rewardAmount: '',
    description: '',
  };

  lostPetUpdateForm: FormGroup;
  public lostPetDetail: LostPet;

  userName: string;
  userImage: string;
  userId: string;
  lostPetId: string;

  constructor(private timelineService: TimelineService,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) {}

  ngOnInit() {
    const lostPetId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.lostPetId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerLostPetDetail(lostPetId, this.userId).subscribe(lostPetDetails => {
      this.lostPetDetail = lostPetDetails;
    });

    this.lostPetUpdateForm = new FormGroup({
      petName: new FormControl(this.newLostPetDetail.petName,[
        Validators.required,
        Validators.minLength(2)
      ]),

      petBreed: new FormControl(this.newLostPetDetail.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),

      petGender: new FormControl(this.newLostPetDetail.petGender,[
        Validators.required,
      ]),

      petColor: new FormControl(this.newLostPetDetail.petColor,[
        Validators.required,
        Validators.minLength(2),
      ]),

      lastLocation: new FormControl(this.newLostPetDetail.lastLocation,[
        Validators.required,
      ]),

      reward: new FormControl(this.newLostPetDetail.reward,[
        Validators.required,
      ]),

      rewardAmount: new FormControl(this.newLostPetDetail.rewardAmount,[
        Validators.required,
      ]),

      description: new FormControl(this.newLostPetDetail.description,[
        Validators.required,
      ])
    });

  }

  getUserId(){
    const user = firebase.auth().currentUser;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newLostPetDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newLostPetDetail.userImage = `${this.userImage}`;
    })
  }

  updateLostPetDetails(): void{
    this.newLostPetDetail.petName = this.lostPetUpdateForm.get('petName').value;
    this.newLostPetDetail.petGender = this.lostPetUpdateForm.get('petGender').value;
    this.newLostPetDetail.petBreed = this.lostPetUpdateForm.get('petBreed').value;
    this.newLostPetDetail.petColor = this.lostPetUpdateForm.get('petColor').value;
    this.newLostPetDetail.lastLocation = this.lostPetUpdateForm.get('lastLocation').value;
    this.newLostPetDetail.reward = this.lostPetUpdateForm.get('reward').value;
    this.newLostPetDetail.rewardAmount = this.lostPetUpdateForm.get('rewardAmount').value;
    this.newLostPetDetail.description = this.lostPetUpdateForm.get('description').value;

    this.timelineService.updateLostPetDetail(this.userId, this.lostPetId, this.newLostPetDetail);
  }

}
