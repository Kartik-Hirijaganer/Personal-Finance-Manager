import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

import { IncomeService } from '../../income/income.service';
import { ExpenseService } from '../../expense/expense.service';

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
    private route: ActivatedRoute
  ) {}

  agInit(params: ICellRendererParams): void {
    this.rowData = params;  
    this.route.url.subscribe((event) => {
      this.path = event[0].path;
    })  
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false; // returning false  will make ag-grid re-create the component when required.
  }

  onSubmit(action: string): void {
    const { id, ...entry } = this.rowData?.data;
    
    if (action === 'delete') {
      if (this.path === 'expenses') {
        this.expenseService.deleteExpense(id);
      } else if (this.path === 'expenses') {
        this.incomeService.deleteIncomeEntry(id, entry);
      } else {
        
      }
    }

    if (action === 'edit' || action === 'save') {
      this.showEdit = !this.showEdit;
      if (this.path === 'expenses') {
        this.expenseService.expenseEditEvent.next({ action, idx: this.rowData?.rowIndex, payload: this.rowData?.data });
      } else if (this.path === 'incomes') {

      } else {

      }
      
    }
  }

}