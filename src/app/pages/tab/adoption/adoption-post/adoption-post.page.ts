import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import { AdoptionsDetail } from 'src/app/models/adoption/adoptions-detail';

@Component({
  selector: 'app-adoption-post',
  templateUrl: './adoption-post.page.html',
  styleUrls: ['./adoption-post.page.scss'],
})
export class AdoptionPostPage implements OnInit {

  public adoptionList: Observable<AdoptionsDetail[]>
  filter: string;

  constructor(private adoptionService: AdoptionService) {
  }

  ngOnInit() {
    this.adoptionList = this.adoptionService.getAdoptionPost();
  }

}
