import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DhikrService {
  morningDhikrPageEntered: Subject<boolean>;
  eveningDhikrPageEntered: Subject<boolean>;
  constructor(private http: HttpClient) {
    this.morningDhikrPageEntered = new Subject();
    this.eveningDhikrPageEntered = new Subject();
   }

  getMorningDhikr() {
    return this.http.get('assets/db/morning-dhikr.json');
  }

  getEveningDhikr() {
    return this.http.get('assets/db/evening-dhikr.json');
  }
}
