import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  newDonationDetail = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    userImage: '',
    userName: '',
    donationTitle: '',
    donationType: '',
    donationAmount: '',
    donationDescription: '',
  };

  donationUpdateForm: FormGroup;
  public donationDetail: Donation;

  userName: string;
  userImage: string;
  userId: string;
  donationId: string;

  constructor(private timelineService: TimelineService,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) {}

  ngOnInit() {

    const donationId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.donationId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerDonationDetail(donationId, this.userId).subscribe(donationDetails => {
      this.donationDetail = donationDetails;
    });

    this.donationUpdateForm = new FormGroup({
      donationTitle: new FormControl(this.newDonationDetail.donationTitle,[
        Validators.required,
        Validators.minLength(2),
      ]),
      donationType: new FormControl(this.newDonationDetail.donationType,[
        Validators.required,
      ]),
      donationAmount: new FormControl(this.newDonationDetail.donationAmount,[
        Validators.required,
      ]),
      donationDescription: new FormControl(this.newDonationDetail.donationDescription,[
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }


  getUserId(){
    const user = firebase.auth().currentUser;

    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newDonationDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newDonationDetail.userImage = `${this.userImage}`;
    })
  }

  updateDonationDetail(): void{
    this.newDonationDetail.donationDescription = this.donationUpdateForm.get('donationDescription').value;
    this.newDonationDetail.donationTitle = this.donationUpdateForm.get('donationTitle').value;
    this.newDonationDetail.donationAmount = this.donationUpdateForm.get('donationAmount').value;
    this.newDonationDetail.donationType = this.donationUpdateForm.get('donationType').value;

    this.timelineService.updateDonationDetail(this.userId, this.donationId, this.newDonationDetail);
  }
}






