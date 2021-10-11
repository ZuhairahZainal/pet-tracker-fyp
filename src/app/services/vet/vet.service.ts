import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Vet } from 'src/app/models/vet/vet';

@Injectable({
  providedIn: 'root'
})
export class VetService {

  constructor(public firestore: AngularFirestore){}

  getVetList(): Observable<Vet[]> {
    return this.firestore.collection<Vet>(`vet`, ref => ref.orderBy('time', 'desc')).valueChanges();
  }

  getVetDetail(vetId: string): Observable<Vet> {
    return this.firestore.collection('vet').doc<Vet>(vetId).valueChanges();
  }
}
