import { Injectable } from "@angular/core";
import { Subject, switchMap } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Income } from "./income.model";
import { UtilService } from "../shared/util.service";
import { environment } from "../../environments/environment.dev";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  public monthlyIncome: number = 0;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })
  public incomeListEvent: Subject<Income[]> = new Subject<Income[]>();
  public monthlyIncomeEvent: Subject<number> = new Subject<number>();
  public incomeEditEvent: Subject<{ action: string, idx: number, payload?: Income }> = new Subject<{ action: string, idx: number, payload?: Income }>();

  constructor(
    private util: UtilService,
    private http: HttpClient
  ) {
    this.getIncomes().subscribe(() => { });
  }

  addIncome(income: Income): Observable<Income[]> {
    return this.http.post(`${environment.URL}:${environment.income_port}/income/add`, income, { headers: this.headers })
      .pipe(switchMap(() => {
        return this.getIncomes();
      }));
  }

  deleteIncome(id: string): Observable<Income[]> {
    return this.http.delete(`${environment.URL}:${environment.income_port}/income/delete/${id}`, { headers: this.headers })
      .pipe(switchMap(() => {
        return this.getIncomes();
      }))
  }

  updateIncome(income: Income): Observable<any> {
    return this.http.put<{ incomeId: string }>(`${environment.URL}:${environment.income_port}/income/update/${income.id}`, income, { headers: this.headers });
  }

  getIncomes(): Observable<Income[]> {
    return this.http.get<{ incomes: Income[] }>(`${environment.URL}:${environment.income_port}/income`, { headers: this.headers })
      .pipe(map(({ incomes }) => {
        this.monthlyIncome = this.util.calculateTotalAmount(incomes);
        this.monthlyIncomeEvent.next(this.monthlyIncome);
        return incomes;
      }));
  }
}