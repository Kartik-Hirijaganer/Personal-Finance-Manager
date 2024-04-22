import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { IncomeService } from '../income/income.service';

@Component({
  selector: 'delete-edit-btn',
  templateUrl: './delete-edit-button.component.html',
  styleUrl: './delete-edit-button.component.css'
})
export class DeleteEditButtonComponent implements ICellRendererAngularComp {

  private rowData: any;
  constructor( private incomeService: IncomeService ) {}

  agInit(params: ICellRendererParams): void {
    this.rowData = params;    
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false; // returning false  will make ag-grid re-create the component when required.
  }

  onSubmit(action: string): void {
    const { payment_id, ...entry } = this.rowData?.data;
    if (action === 'delete') {
      this.incomeService.deleteIncomeEntry(payment_id, entry);
    }
  }

}