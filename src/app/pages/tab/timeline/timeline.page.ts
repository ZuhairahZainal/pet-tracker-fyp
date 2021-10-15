import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Donation, Feed, LostPet } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';

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

  addtoFriendNotif={
    category: 'Add Friend',
    userImage: '',
    userName: '',
    time: new Date().getTime(),
    date: new Date().toDateString(),
  }

  friendList = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    friendId: '',
    userId: '',
    userName: '',
    userImage: '',
  }

  friendList1 = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    friendId: '',
    userId: '',
    userName: '',
    userImage: '',
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
  favPostId: string;

  constructor(private timelineService: TimelineService,
              private firestore: AngularFirestore,
              private router: Router,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    this.alertUser();
    this.getUserId();

    this.lostpetPost = this.timelineService.getLostPetPost();

    this.donationPost = this.timelineService.getDonationPost();

    this.newPost = this.timelineService.getFeedPost();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async alertUser(){
    let alert = await this.alertCtrl.create({
      header: `Welcome user to Pet Tracker app!`,
      message: `Please set a profile picture before proceeding your adventure in our application.
                Go to User Profile -> in Personal Information. Choose your image and it will automatically
                set as your profile picture.`,
    buttons: [{
              text: 'Done',
              },
              {
            text: 'Proceed',
            handler: () => {
              this.router.navigate(['/tab/user-profile/personal-info']);
            },
          }]
   });
    alert.present();
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.reportDetails.userId = `${user.uid}`;
    this.friendList1.userId = `${user.uid}`;

    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
      this.reportDetails.userName = userDetail['name'];
      this.reportDetails.userEmail = userDetail['email'];
      this.reportDetails.userImage = userDetail['userImage'];

      this.friendList1.userName = userDetail['name'];
      this.friendList1.userImage = userDetail['userImage'];


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

  addFavouritePostToDB( time: number,
                        date: string,
                        category: string,
                        postId: string,
                        postTitle: string,
                        postDescription: string,
                        postImage: string,
                        userId: string,
                        userImage: string,
                        userName: string,){
    this.favPostId = this.firestore.createId();

    this.firestore.collection('users').doc(this.userId).collection('fav-posts').doc(this.favPostId).set({
      timeAdded: new Date().getTime(),
      favId: this.favPostId,
      category: category,
      postId: postId,
      postTitle: postTitle,
      postDescription: postDescription,
      postImage: postImage,
      userId: userId,
      userImage: userImage,
      userName: userName,
      time: time,
      date: date
    }).then( success => {
      this.router.navigate(['tab/user-profile/setting/liked-post']);
    })
  }

  addFavouriteLostPetPostToDB(time: number,
                              date: string,
                              category: string,
                              lostPetId: string,
                              userId: string,
                              userImage: string,
                              userName: string,
                              petName: string,
                              petGender: string,
                              petBreed: string,
                              petColor: string,
                              lastLocation: string,
                              reward: string,
                              rewardAmount: number,
                              description: string,
                              petImage: string){

    this.favPostId = this.firestore.createId();

    this.firestore.collection('users').doc(this.userId).collection('fav-posts').doc(this.favPostId).set({
      timeAdded: new Date().getTime(),
      favId: this.favPostId,
      category: category,
      lostPetId: lostPetId,
      userId: userId,
      userImage: userImage,
      userName: userName,
      time: time,
      date: date,
      petName: petName,
      petGender: petGender,
      petBreed: petBreed,
      petColor: petColor,
      lastLocation: lastLocation,
      rewardAmount: rewardAmount,
      description: description,
      petImage: petImage
    }).then( success => {
      this.router.navigate(['tab/user-profile/setting/liked-post']);
    })
  }

  addFavouriteDonationPostToDB(time: number,
                              date: string,
                              category: string,
                              donationId: string,
                              userId: string,
                              userImage: string,
                              userName: string,
                              donationTitle: string,
                              donationType: string,
                              donationAmount: number,
                              donationDescription: string,
                              donationImage: string){

      this.favPostId = this.firestore.createId();

      this.firestore.collection('users').doc(this.userId).collection('fav-posts').doc(this.favPostId).set({
        timeAdded: new Date().getTime(),
        favId: this.favPostId,
        category: category,
        donationId: donationId,
        userId: userId,
        userImage: userImage,
        userName: userName,
        time: time,
        date: date,
        donationTitle: donationTitle,
        donationType: donationType,
        donationAmount: donationAmount,
        donationDescription: donationDescription,
        donationImage: donationImage
      }).then( success => {
        this.router.navigate(['tab/user-profile/setting/liked-post']);
      })
  }

  addToFriendList(id, name, image){

    this.friendList.friendId = this.firestore.createId();
    this.friendList.userId = id;
    this.friendList.userName = name;
    this.friendList.userImage = image;

    this.addtoFriendNotif.userName = this.friendList1.userName;
    this.addtoFriendNotif.userImage = this.friendList1.userImage;

    this.firestore.collection('users').doc(this.friendList.userId).collection('notification').add(this.addtoFriendNotif);

    this.firestore.collection('users').doc(this.friendList.userId).collection('friendlist').doc(this.friendList.friendId).set(this.friendList1);

    this.firestore.collection('users').doc(this.userId).collection('friendlist').doc(this.friendList.friendId).set(this.friendList)
    .then ( async success => {
      let alert = await this.alertCtrl.create({
        header: `Add ${name} as friend!`,
        message: `${name} is added to friend list`,
        buttons: [{
        text: 'OK',
       handler: () => {
        this.router.navigate(['/tab/online-chat']);
          }
       }]
     });
      alert.present();
    })
  }
}
