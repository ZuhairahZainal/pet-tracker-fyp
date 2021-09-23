import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-adoption-post',
  templateUrl: './adoption-post.page.html',
  styleUrls: ['./adoption-post.page.scss'],
})
export class AdoptionPostPage implements OnInit {

  adoptionList;
  filter: string;

  constructor( private firestore: AngularFirestore) {
    this.firestore.collection('adoptionList').valueChanges({idField: 'petId'}).subscribe(
      adoptionList => {
        this.adoptionList = adoptionList;
        console.log(adoptionList);
      }
    )
  }

  ngOnInit() {
  }

}
