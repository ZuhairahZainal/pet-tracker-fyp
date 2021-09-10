import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.page.html',
  styleUrls: ['./adoption-details.page.scss'],
})
export class AdoptionDetailsPage implements OnInit {

  adoptionList;
  filter: string;
  petId: any;
  adopt: number = 0;

  constructor(private firestore: AngularFirestore,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

      this.petId = this.activatedRoute.snapshot.paramMap.get('petId');

      this.getData(this.petId).subscribe( (data) => {
        this.adoptionList = data;
        console.log(this.adoptionList);
      }
    );
  }

  ngOnInit() {
  }

  getData(petId) {
    return this.firestore.collection('adoptionList').doc(petId).valueChanges({idField: 'petId'});
  }

  // alum siap
  adoptPet(){
    this.adopt++;
  }

}
