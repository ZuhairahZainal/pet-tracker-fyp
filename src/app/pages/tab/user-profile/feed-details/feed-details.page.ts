import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Feed } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.page.html',
  styleUrls: ['./feed-details.page.scss'],
})
export class FeedDetailsPage implements OnInit {

  public feedDetails: Feed;
  feedId: string;
  userId: string;

  constructor(private firestore: AngularFirestore,
              private timelineService: TimelineService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}


  ngOnInit() {
    this.feedId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerFeedDetail(this.feedId, this.userId).subscribe(feedDetails => {
      this.feedDetails = feedDetails;
    });

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async deleteFeedPost(feedId: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.removePost(feedId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  removePost(feedId: string){
    this.firestore.doc('newsFeedPost/' + feedId).delete();
    this.firestore.collection('feed').doc(this.userId).collection('newsFeed').doc(feedId).delete().then(() => {
      this.router.navigate(['tab/user-profile']);
    })
  }
}
