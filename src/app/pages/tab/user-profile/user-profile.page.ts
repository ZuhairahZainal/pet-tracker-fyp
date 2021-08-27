import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  adoptionList;
  public segment: string = "allpost";

  constructor( private firestore: AngularFirestore) {
    this.firestore.collection('adoptionList').valueChanges({idField: 'petId'}).subscribe(
      adoptions => {
        this.adoptionList = adoptions;
        console.log(this.adoptionList);
      }
    )
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

}
