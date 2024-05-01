import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

import { IncomeService } from '../../income/income.service';
import { ExpenseService } from '../../expense/expense.service';
import { LiabilityService } from '../../liability/liability.service';

@Component({
  selector: 'action',
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements ICellRendererAngularComp {
  private rowData: any;
  private path: string = '';
  public showEdit: boolean = true;

  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private liabilityService: LiabilityService,
    private route: ActivatedRoute
  ) { }

  agInit(params: ICellRendererParams): void {
    this.rowData = params;
    this.route.url.subscribe((event) => {
      this.path = event[0].path;
    })
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false; // returning false  will make ag-grid re-create the component when required.
  }

  handleExpenseEvent(action: string, idx: number, payload: any) {
    if (action === 'delete') {
      this.expenseService.expenseEditEvent.next({ action, idx, payload });
    } else {
      this.showEdit = !this.showEdit;
      this.expenseService.expenseEditEvent.next({ action, idx, payload: this.rowData?.data });
    }
  }

  handleIncomeEvent(action: string, idx: number, payload: any) {
    if (action === 'delete') {
      this.incomeService.incomeEditEvent.next({ action, idx, payload });
    } else {
      this.showEdit = !this.showEdit;
      this.incomeService.incomeEditEvent.next({ action, idx, payload: this.rowData?.data });
    }
  }

  handleLiabilityEvent(action: string, idx: number, payload: any) {
    if (action === 'delete') {
      this.liabilityService.liabilityEditEvent.next({ action, idx, payload });
    } else {
      this.showEdit = !this.showEdit;
      this.liabilityService.liabilityEditEvent.next({ action, idx, payload: this.rowData?.data });
    }
  }

  onSubmit(action: string): void {
    switch (this.path) {
      case 'expenses':
        this.handleExpenseEvent(action, this.rowData?.rowIndex, this.rowData?.data);
        break;
      case 'incomes':
        this.handleIncomeEvent(action, this.rowData?.rowIndex, this.rowData?.data);
        break;
      case 'liabilities':
        this.handleLiabilityEvent(action, this.rowData?.rowIndex, this.rowData?.data);
        break;
    }
  }
}