import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
})
export class AdoptionPage implements OnInit {

  adoptionList;
  filter: string;

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

}
