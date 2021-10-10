import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Donation, Feed, LostPet } from 'src/app/models/timeline/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  public lostpetPost: Observable<LostPet[]>;
  public donationPost: Observable<Donation[]>;
  public newPost: Observable<Feed[]>;

  public segment: string = 'newsfeed';
  filter: string;

  constructor(private afauth: AngularFireAuth,
              private timelineService: TimelineService,
              private router: Router) {}

  ngOnInit() {
    this.lostpetPost = this.timelineService.getLostPetPost();

    this.donationPost = this.timelineService.getDonationPost();

    this.newPost = this.timelineService.getFeedPost();
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
