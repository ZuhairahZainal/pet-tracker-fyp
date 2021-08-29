import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liked-post',
  templateUrl: './liked-post.page.html',
  styleUrls: ['./liked-post.page.scss'],
})
export class LikedPostPage implements OnInit {

  type: string;

  constructor() { }

  ngOnInit() {
    this.type = 'first';
  }

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
  }

}
