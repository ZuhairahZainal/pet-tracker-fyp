import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  lostpetPost;
  donationPost;
  newPost;
  public segment: string = 'allpost';

  constructor(private firestore: AngularFirestore,
              private afauth: AngularFireAuth,
              private router: Router) {
    this.firestore.collection('lostpetPost').valueChanges({idField: 'lostpetId'}).subscribe(
      adoptions => {
        this.lostpetPost = adoptions;
      }
    )

    this.firestore.collection('donationPost').valueChanges({idField: 'donationId'}).subscribe(
      adoptions => {
        this.donationPost = adoptions;
      }
    )

    this.firestore.collection('newPost').valueChanges({idField: 'newId'}).subscribe(
      adoptions => {
        this.newPost = adoptions;
      }
    )
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }


  logout()
  {
    this.afauth.signOut().then(()=> {
      this.router.navigate(['/auth/login']);
    });
  }

}
