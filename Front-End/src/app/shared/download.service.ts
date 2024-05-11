import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import * as template from './pdf_template.json';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  generatePdf(cashflow: any, income: number, expense: number, liability: number, user: {userName: string, accountNo: number}) {
    const letter_data = {
      prepared: this.getCurrentDate(),
      account: user.accountNo,
      applicant_name: user.userName,
      summary: {
        current: income - (expense + liability),
        income,
        expense,
        liability
      },
      cash_flow: cashflow.reduce((xs: any, x: any) => {
        xs[0].values.push(x.income);
        xs[1].values.push(x.expense);
        xs[2].values.push(x.liability);
        return xs;
      }, [{ name: 'Income', values: [] }, { name: 'Expense', values: [] }, { name: 'Liability', values: [] }]),
      totals: cashflow.reduce((xs: any, x: any) => {
        if (x.income === '' && x.expense === '' && x.liability === '') {
          xs.push('');
        } else {
          xs.push(x.income - (x.expense + x.liability));
        }
        return xs;
      }, []),
      firstHalf: (new Date().getMonth() + 1) <= 6
    }
    this.showPdf(template, `cashflow_${user.accountNo}`, letter_data);
  }

  getCurrentDate() {
    const date: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const day: number = date.getDate();
    const formattedDate: string = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th') + ' ' + date.toLocaleDateString('en-US', options);
    return formattedDate.toString();
  }

  showPdf(data: any, fileName: string = 'cashflow', letter_data: any) {
    this.http.post(`${environment.URL}:${environment.user_port}/user/generate-pdf`, { data, payload: letter_data }, { headers: { 'Content-Type': 'application/json', 'Authorization': this.authService.getToken() }, responseType: 'blob' })
      .pipe(
        catchError((err) => {
          const errorMessage: string = err?.error?.error?.errorMessage;
          this.toastr.error(errorMessage, 'Falied to generate PDF');
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          var pdf_link = document.createElement('a');
          pdf_link.href = pdfUrl;
          pdf_link.download = fileName;
          pdf_link.click();
        }
      })
  }
}