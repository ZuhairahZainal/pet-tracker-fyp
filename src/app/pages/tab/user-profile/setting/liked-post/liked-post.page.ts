import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Fav } from 'src/app/models/fav/fav';
import { FavService } from 'src/app/services/fav/fav.service';
import firebase from 'firebase'

@Component({
  selector: 'app-liked-post',
  templateUrl: './liked-post.page.html',
  styleUrls: ['./liked-post.page.scss'],
})
export class LikedPostPage implements OnInit {

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

  public favs: Observable<Fav[]>;
  public segment: string = 'newsfeed';
  userId: string;

  constructor(private favService: FavService,
              private firestore: AngularFirestore,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.checkUser();
    this.favs = this.favService.getUserPinned(this.userId);
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    // console.log('Segment changed', ev);
  }

  checkUser(){
    let user = firebase.auth().currentUser;
    this.userId = `${user.uid}`;
    this.reportDetails.userId = this.userId;

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

  deletePost(favId){
    this.firestore.collection('users').doc(this.userId).collection('fav-posts').doc(favId).delete()
    .then( async success => {
      let alert = await this.alertCtrl.create({
        header: 'Post Removed',
        message: 'Post has been removed from this section.',
        buttons: [{
          text: 'OK'
        }]
      });
      alert.present();
    })
  }

  async removePost(favId){
    let alert = await this.alertCtrl.create({
      header: 'Remove Post',
      subHeader: 'Are you sure you want to remove this post?',
      buttons: [{
        text: 'No',
        role: 'cancel',
      },
      {
        text: 'Yes',
        handler: data => this.deletePost(favId)
      }]
    })
    alert.present();
  }

}
