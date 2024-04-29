import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Liability } from './liability.model';
import { UtilService } from '../shared/util.service';

@Injectable({
  providedIn: 'root'
})
export class LiabilityService {
  private liabilityList: Liability[] = [
    {
      id: 1,
      name: 'John',
      amount: 10000,
      due_date: '31-04-2024',
      description: 'Laundry'
    },
    {
      id: 2,
      name: 'Hue',
      amount: 10000,
      due_date: '31-04-2024',
      description: 'Stationary'
    },
    {
      id: 3,
      name: 'Susan',
      amount: 10000,
      due_date: '01-05-2024',
      description: 'News Paper'
    },
    {
      id: 4,
      name: 'Alex',
      amount: 10000,
      due_date: '31-04-2024',
      description: 'Canteen'
    }
  ]
  public monthlyLiability: number = 0;
  public liabilityEvent: Subject<Liability[]> = new Subject<Liability[]>();
  public liabilityEditEvent: Subject<{ action: string, idx: number, payload?: Liability }> = new Subject<{ action: string, idx: number, payload?: Liability }>();

  constructor ( private util: UtilService ) {}

  addLiability(liability: Liability): void {
    const id: number = (this.liabilityList[this.liabilityList.length - 1]?.id || 0) + 1;
    liability.id = id;
    this.liabilityList.push(liability);
    this.monthlyLiability += liability?.amount;
    this.liabilityEvent.next(this.liabilityList.slice(0));
  }

  deleteLiability(id: number): void {
    const idx: number = this.liabilityList.findIndex(liability => liability?.id === id);
    this.monthlyLiability -= this.liabilityList[idx]?.amount || 0;
    this.liabilityList.splice(idx, 1);
    this.liabilityEvent.next(this.liabilityList.slice(0));
  }

  updateLiability(liability: Liability): void {
    const id: number = liability.id;
    const idx: number = this.liabilityList.findIndex(liability => liability?.id === id);
    this.liabilityList.splice(idx, 1, liability);
    this.liabilityEvent.next(this.liabilityList.slice(0));
    this.monthlyLiability = this.util.calculateMonthlyTotal(this.liabilityList);
  }

  get liabilities(): Liability[] {
    return this.liabilityList.slice(0);
  }

}