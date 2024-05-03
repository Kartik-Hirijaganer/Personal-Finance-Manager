import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';

import { Liability } from '../liability/liability.model';
import { Income } from '../income/income.model';
import { Expense } from '../expense/expense.model';
import * as template from './pdf_template.json';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private letter_data = {};
  constructor(private http: HttpClient) { }

  generatePdf(payload: any) {
    payload = {
      "incomes": [
        {
          "id": "JOHN0B50",
          "to": "John",
          "date": "5/1/2024",
          "month": {
            "type": "jan",
            "name": "Jan",
            "id": 1
          },
          "amount": 12985,
          "description": "Food Delivery"
        },
        {
          "id": "HON0B50",
          "to": "Honar",
          "date": "5/1/2024",
          "month": {
            "type": "feb",
            "name": "Feb",
            "id": 2
          },
          "amount": 1985,
          "description": "Canteen lunch"
        },
        {
          "id": "NIN0B49",
          "to": "Nina",
          "date": "5/1/2024",
          "month": {
            "type": "mar",
            "name": "Mar",
            "id": 3
          },
          "amount": 13985,
          "description": "Furniture - Table"
        },
        {
          "id": "LIL0C50",
          "to": "Lily",
          "date": "5/1/2024",
          "month": {
            "type": "apr",
            "name": "Apr",
            "id": 4
          },
          "amount": 2985,
          "description": "Flower - Rose"
        },
        {
          "id": "NUE1B50",
          "to": "Nue",
          "date": "5/1/2024",
          "month": {
            "type": "may",
            "name": "May",
            "id": 1
          },
          "amount": 1095,
          "description": "Glue"
        },
        {
          "id": "HIK0B00",
          "to": "Hike",
          "date": "5/1/2024",
          "month": {
            "type": "jun",
            "name": "Jun",
            "id": 6
          },
          "amount": 33983,
          "description": "Bike Petrol"
        }
      ],
      "expenses": [
        {
          "id": "HON0B50",
          "to": "Honar",
          "date": "5/1/2024",
          "month": {
            "type": "feb",
            "name": "Feb",
            "id": 2
          },
          "amount": 1985,
          "description": "Canteen lunch"
        },
        {
          "id": "NIN0B49",
          "to": "Nina",
          "date": "5/1/2024",
          "month": {
            "type": "mar",
            "name": "Mar",
            "id": 3
          },
          "amount": 13985,
          "description": "Furniture - Table"
        },
        {
          "id": "LIL0C50",
          "to": "Lily",
          "date": "5/1/2024",
          "month": {
            "type": "apr",
            "name": "Apr",
            "id": 4
          },
          "amount": 2985,
          "description": "Flower - Rose"
        },
        {
          "id": "NUE1B50",
          "to": "Nue",
          "date": "5/1/2024",
          "month": {
            "type": "may",
            "name": "May",
            "id": 1
          },
          "amount": 1095,
          "description": "Glue"
        },
        {
          "id": "HIK0B00",
          "to": "Hike",
          "date": "5/1/2024",
          "month": {
            "type": "jun",
            "name": "Jun",
            "id": 6
          },
          "amount": 33983,
          "description": "Bike Petrol"
        },
        {
          "id": "KAL9B50",
          "to": "Kale",
          "date": "5/1/2024",
          "month": {
            "type": "jly",
            "name": "Jul",
            "id": 7
          },
          "amount": 985,
          "description": "Clothes"
        }
      ],
      "liabilities": [
        {
          "id": "HON0B50",
          "to": "Honar",
          "date": "5/1/2024",
          "month": {
            "type": "feb",
            "name": "Feb",
            "id": 2
          },
          "amount": 1985,
          "description": "Canteen lunch"
        },
        {
          "id": "NIN0B49",
          "to": "Nina",
          "date": "5/1/2024",
          "month": {
            "type": "mar",
            "name": "Mar",
            "id": 3
          },
          "amount": 13985,
          "description": "Furniture - Table"
        },
        {
          "id": "LIL0C50",
          "to": "Lily",
          "date": "5/1/2024",
          "month": {
            "type": "apr",
            "name": "Apr",
            "id": 4
          },
          "amount": 2985,
          "description": "Flower - Rose"
        },
        {
          "id": "NUE1B50",
          "to": "Nue",
          "date": "5/1/2024",
          "month": {
            "type": "may",
            "name": "May",
            "id": 1
          },
          "amount": 1095,
          "description": "Glue"
        },
        {
          "id": "HIK0B00",
          "to": "Hike",
          "date": "5/1/2024",
          "month": {
            "type": "jun",
            "name": "Jun",
            "id": 6
          },
          "amount": 33983,
          "description": "Bike Petrol"
        },
        {
          "id": "KAL9B50",
          "to": "Kale",
          "date": "5/1/2024",
          "month": {
            "type": "jly",
            "name": "Jul",
            "id": 7
          },
          "amount": 985,
          "description": "Clothes"
        }
      ]
    }

    this.letter_data = {
      prepared: this.getCurrentDate(),
      account: '4934459344',
      applicant_name: 'John Muller',
      summary: {
        current: (this.calculateTotalAmount(payload.incomes) - (this.calculateTotalAmount(payload.liabilities) - this.calculateTotalAmount(payload.expenses))),
        income: this.calculateTotalAmount(payload.incomes),
        expense: this.calculateTotalAmount(payload.expenses),
        liability: this.calculateTotalAmount(payload.liabilities)
      },
      cash_flow: [
        {
          name: 'Income',
          values: payload.incomes.map((income: Income) => income.amount)
        },
        {
          name: 'Expense',
          values: payload.expenses.map((expense: Expense) => expense.amount)
        },
        {
          name: 'Liability',
          values: payload.liabilities.map((liability: Liability) => liability.amount)
        }
      ],
      totals: this.calculateBalance(payload.incomes, payload.expenses, payload.liabilities, payload.incomes.length),
      firstHalf: (new Date().getMonth() + 1) <= 6
    }
    this.showPdf(template, 'cashflow_494341004');
  }

  calculateBalance(incomes: Income[], expenses: Expense[], liabilities: Liability[], n: number): number[] {
    const totals: number[] = [];
    for (let i = 0; i < n; i++) {
      const total = incomes[i].amount - (expenses[i].amount + liabilities[i].amount);
      totals.push(total);
    }
    return totals;
  }

  getCurrentDate() {
    const date: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const day: number = date.getDate();
    const formattedDate: string = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th') + ' ' + date.toLocaleDateString('en-US', options);
    return formattedDate.toString();
  }

  calculateTotalAmount(input: Income[] | Expense[] | Liability[]) {
    return input.reduce((xs, x) => {
      xs += x.amount;
      return xs;
    }, 0);
  }


  showPdf(data: any, fileName: string = 'cashflow') {
    this.http.post('http://localhost:3000/generate-pdf', { data, payload: this.letter_data }, { headers: { 'Content-Type': 'application/json' }, responseType: 'blob' })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null)
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