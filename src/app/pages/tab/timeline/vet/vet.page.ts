import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Vet } from 'src/app/models/vet/vet';
import { VetService } from 'src/app/services/vet/vet.service';

@Component({
  selector: 'app-vet',
  templateUrl: './vet.page.html',
  styleUrls: ['./vet.page.scss'],
})
export class VetPage implements OnInit {

  public vetLists: Observable<Vet[]>;
  filter: string;

  constructor(private vetService: VetService) { }

  ngOnInit() {
    this.vetLists = this.vetService.getVetList();

  }


}
