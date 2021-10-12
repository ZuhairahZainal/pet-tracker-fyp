import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Donation, Feed, LostPet } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  reportDetails = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    reportType: 'Report Post',
    reportStatus: 'Pending',
    reportDescription: '',
    reportId: '',
    userId: '',
    userName: '',
    userEmail: '',
    userImage: '',
    postId: '',
    ownerId: ''
  }

  public lostpetPost: Observable<LostPet[]>;
  public donationPost: Observable<Donation[]>;
  public newPost: Observable<Feed[]>;

  public segment: string = 'newsfeed';
  filter: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string;


  constructor(private afauth: AngularFireAuth,
              private timelineService: TimelineService,
              private firestore: AngularFirestore,
              private router: Router,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    this.getUserId();

    this.lostpetPost = this.timelineService.getLostPetPost();

    this.donationPost = this.timelineService.getDonationPost();

    this.newPost = this.timelineService.getFeedPost();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.reportDetails.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
      this.reportDetails.userName = userDetail['name'];
      this.reportDetails.userEmail = userDetail['email'];
      this.reportDetails.userImage = userDetail['userImage'];
    })
  }

  sendReport(ownerId: string, postId: string, description: string){
    this.reportDetails.reportId =  this.firestore.createId();
    this.reportDetails.ownerId = ownerId;
    this.reportDetails.postId = postId;
    this.reportDetails.reportDescription = description;

    this.firestore.collection('report').doc(this.reportDetails.reportId).set(this.reportDetails);
    this.firestore.collection('admin-notif').doc(this.reportDetails.reportId).set(this.reportDetails)

    .then( async success => {
      let alert = await this.alertCtrl.create({
        header: 'Report Submitted',
        message: 'Thank you for helping us reporting unappropriate post. We, Pet Tracker, will be notfied upon this report.',
        buttons: [{
          text: 'DONE'
        }]
      });
      alert.present();
    })
  }

  async reportPost(ownerId: string, postId: string){
    let alert = await this.alertCtrl.create({
      header: 'Report Post',
      subHeader: 'Please state the reason why you want to report this post.',
      inputs: [
        {
          name:'reportReason',
          placeholder: 'Enter your reason here',
          type: 'textarea'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Submit report',
        handler: data => this.sendReport(ownerId, postId, data.reportReason)
      }]
    })
    alert.present();
  }
}
