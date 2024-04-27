import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ColDef, RowValueChangedEvent, GridOptions } from "ag-grid-community";
import { Subscription } from 'rxjs';

import { IncomeService } from './income.service';
import { Income } from './income.model';
import { ActionComponent } from '../shared/action/action.component';
import { UtilService } from '../shared/util.service'

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css', '../shared/custom.styles.css']
})
export class IncomeComponent implements OnInit, OnDestroy {
  incomeForm: FormGroup = new FormGroup({});
  incomeColDefs: ColDef[] = [
    { field: "id", 
      headerName: "Payment ID"
    },
    { field: "from", headerName: "Received From" },
    { field: "amount", 
      headerName: "Amount",
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$')
    },
    { field: "date" },
    { field: "description" },
    { field: "Action", 
      editable: false,
      cellRenderer: ActionComponent
     }
  ];
  incomeRowData: Income[] = [];
  agGridOptions: GridOptions = {
    domLayout: 'autoHeight',
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }
  hideIncomeForm: boolean = true;
  incomeListSubscription: Subscription = new Subscription;

  constructor(
    public incomeService: IncomeService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.incomeForm = new FormGroup({
      'from': new FormControl<string>('', Validators.required),
      'date': new FormControl<string>('', Validators.required),
      'amount': new FormControl<number>(0, Validators.required),
      'description': new FormControl<string | null>('')
    });
    this.incomeRowData = this.incomeService.getIncomeList();
    this.incomeService.monthly_income = this.util.calculateMonthlyTotal(this.incomeRowData);
    this.incomeListSubscription = this.incomeService.incomeListEvent.subscribe((updatedIncomeList: Income[]) => {
      this.incomeRowData = updatedIncomeList;
    })
  }

  toggleIncomeForm(): void {
    this.hideIncomeForm = !this.hideIncomeForm;
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    this.incomeService.updateIncomeEntry(event?.data);
  }

  onSubmit(): void {
    const { from, date, amount, description } = this.incomeForm.getRawValue();
    this.incomeService.addIncomeEntry(from, date, amount, description);
    this.toggleIncomeForm();
  }

  ngOnDestroy(): void {
    this.incomeListSubscription.unsubscribe();
  }
}
