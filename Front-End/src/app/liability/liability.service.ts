import { Injectable } from '@angular/core';
import { Observable, Subject, switchMap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Liability } from './liability.model';
import { UtilService } from '../shared/util.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class LiabilityService {
  public monthlyLiability: number = 0;
  public monthlyLiabilityEvent: Subject<number> = new Subject<number>();
  public liabilityListEvent: Subject<Liability[]> = new Subject<Liability[]>();
  public liabilityEditEvent: Subject<{ action: string, idx: number, payload?: Liability }> = new Subject<{ action: string, idx: number, payload?: Liability }>();
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })


  constructor(
    private util: UtilService,
    private http: HttpClient
  ) {
    this.getLiabilities().subscribe(() => { });
  }

  addLiability(liability: Liability): Observable<Liability[]> {
    console.log(liability);

    return this.http.post(`${environment.URL}:${environment.liability_port}/liability/add`, liability, { headers: this.headers })
      .pipe(switchMap(() => {
        return this.getLiabilities();
      }));
  }

  deleteLiability(id: string): Observable<Liability[]> {
    return this.http.delete(`${environment.URL}:${environment.liability_port}/liability/delete/${id}`, { headers: this.headers })
      .pipe(switchMap(() => {
        return this.getLiabilities();
      }))
  }

  updateLiability(liability: Liability): Observable<any> {
    return this.http.put<{ liabilityId: string }>(`${environment.URL}:${environment.liability_port}/liability/update/${liability.id}`, liability, { headers: this.headers });
  }

  getLiabilities(): Observable<Liability[]> {
    return this.http.get<{ liabilities: Liability[] }>(`${environment.URL}:${environment.liability_port}/liability`, { headers: this.headers })
      .pipe(map(({ liabilities }) => {
        this.monthlyLiability = this.util.calculateTotalAmount(liabilities);
        this.monthlyLiabilityEvent.next(this.monthlyLiability);
        return liabilities;
      }));
  }

}