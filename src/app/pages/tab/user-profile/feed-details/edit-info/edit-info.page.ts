import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Feed } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  newPostDetail={
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    postTitle: '',
    postDescription: '',
    userImage: '',
    userName: '',
  }

  feedUpdateForm: FormGroup;
  public feedDetail: Feed;

  userName: string;
  userImage: string;
  userId: string;
  feedId: string;

  constructor(private timelineService: TimelineService,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) {}

  ngOnInit() {
    const feedId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.feedId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.timelineService.ownerFeedDetail(feedId, this.userId).subscribe(feedDetails => {
      this.feedDetail = feedDetails;
    });

    this.feedUpdateForm = new FormGroup({
      postTitle: new FormControl(this.newPostDetail.postTitle,[
        Validators.required,
        Validators.minLength(2)
      ]),

      postDescription: new FormControl(this.newPostDetail.postDescription,[
        Validators.required,
        Validators.minLength(2),
      ])
    });
  }

  getUserId(){
    const user = firebase.auth().currentUser;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newPostDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newPostDetail.userImage = `${this.userImage}`;
    })
  }

  updatePostDetail(): void{
    this.newPostDetail.postTitle = this.feedUpdateForm.get('postTitle').value;
    this.newPostDetail.postDescription = this.feedUpdateForm.get('postDescription').value;

    this.timelineService.updateNewsFeedDetail(this.userId, this.feedId, this.newPostDetail);
  }

}
