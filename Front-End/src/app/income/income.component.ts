import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ColDef, GridReadyEvent, GridOptions, GridApi } from "ag-grid-community";
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
      headerName: "Payment ID",
      editable: false
    },
    { field: "from", headerName: "Received From", editable: true },
    { field: "amount", 
      headerName: "Amount",
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$'),
      editable: true
    },
    { field: "date", headerName: "Date", editable: true },
    { field: "description", headerName: "Description", editable: true },
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
  private gridApi!: GridApi;
  incomeListSubscription: Subscription = new Subscription;
  incomeRowSubscription: Subscription = new Subscription;

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
    this.incomeRowSubscription = this.incomeService.incomeEditEvent.subscribe(({ action, idx, payload }) => {
      if (action === 'edit') {
        this.gridApi.setFocusedCell(idx, "from");
        this.gridApi.startEditingCell({
          rowIndex: idx,
          colKey: "from",
        });
      } else {
        this.gridApi.stopEditing();
        this.incomeService.updateIncome(payload as Income);
      }
    })
  }

  toggleIncomeForm(): void {
    this.hideIncomeForm = !this.hideIncomeForm;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSubmit(): void {
    const { from, date, amount, description } = this.incomeForm.getRawValue();
    this.incomeService.addIncome(from, date, amount, description);
    this.toggleIncomeForm();
  }

  ngOnDestroy(): void {
    this.incomeListSubscription.unsubscribe();
    this.incomeRowSubscription.unsubscribe();
  }
}
