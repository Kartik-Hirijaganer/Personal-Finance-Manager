import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

import { IncomeService } from '../../income/income.service';
import { ExpenseService } from '../../expense/expense.service';
import { LiabilityService } from '../../liability/liability.service';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements ICellRendererAngularComp {
  private rowData: any;
  private path: string = '';
  public showEdit: boolean = true;
  public enableDelete: boolean = false;
  public enableEdit: boolean = false;
  public enableSelect: boolean = false;
  public isSelected: boolean = false;

  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private liabilityService: LiabilityService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  agInit(params: any): void {
    this.rowData = params;
    
    this.enableDelete = params?.actions?.delete;
    this.enableEdit = params?.actions?.edit;
    this.enableSelect = params?.actions?.select;
    if (this.enableSelect) {
      this.isSelected = params?.data?.selected;
    }
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

  onSelect() {
    this.accountService.accountSelectEvent.next(this.rowData.data);    
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