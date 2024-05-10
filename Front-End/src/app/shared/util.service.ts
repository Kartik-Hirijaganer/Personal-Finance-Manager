import { Injectable } from '@angular/core';
import { GridApi } from 'ag-grid-community';

import { Liability } from '../liability/liability.model';
import { Expense } from '../expense/expense.model';
import { Income } from '../income/income.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  toggle(state: boolean): boolean {
    return !state;
  }

  currencyFormatter(currency: number, sign: string) {
    const amount = currency.toFixed(0);
    const formatted = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  getAllRows(params: GridApi): Expense[] | Income[] | Liability[] {
    const rowData: Expense[] | Income[] | Liability[] = [];
    params.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  calculateTotalAmount(list: Liability[] | Income[] | Expense[]): number {
    let total: number = 0;
    for (const entry of list) {
      if (entry?.amount) {
        total += entry.amount;
      }
    }
    
    return total;
  }

  public data = [
    {
      "id": "JOHN0B50",
      "to": "John",
      "date": "5/1/2024",
      "month": {
        type: "jan",
        name: "Jan",
        id: 1
      },
      "amount": 12985,
      "description": "Food Delivery"
    },
    {
      "id": "HON0B50",
      "to": "Honar",
      "date": "5/1/2024",
      "month": {
        type: "feb",
        name: "Feb",
        id: 2
      },
      "amount": 1985,
      "description": "Canteen lunch"
    },
    {
      "id": "NIN0B49",
      "to": "Nina",
      "date": "5/1/2024",
      "month": {
        type: "mar",
        name: "Mar",
        id: 3
      },
      "amount": 13985,
      "description": "Furniture - Table"
    },
    {
      "id": "LIL0C50",
      "to": "Lily",
      "date": "5/1/2024",
      "month": {
        type: "apr",
        name: "Apr",
        id: 4
      },
      "amount": 2985,
      "description": "Flower - Rose"
    },
    {
      "id": "NUE1B50",
      "to": "Nue",
      "date": "5/1/2024",
      "month": {
        type: "may",
        name: "May",
        id: 1
      },
      "amount": 1095,
      "description": "Glue"
    },
    {
      "id": "HIK0B00",
      "to": "Hike",
      "date": "5/1/2024",
      "month": {
        type: "jun",
        name: "Jun",
        id: 6
      },
      "amount": 33983,
      "description": "Bike Petrol"
    },
    {
      "id": "KAL9B50",
      "to": "Kale",
      "date": "5/1/2024",
      "month": {
        type: "jly",
        name: "Jul",
        id: 7
      },
      "amount": 985,
      "description": "Clothes"
    }
  ]
}