import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, RowValueChangedEvent, GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ExpenseService } from './expense.service';
import { UtilService } from '../shared/util.service';
import { Expense } from './expense.model';
import { ActionComponent } from '../shared/action/action.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css', '../shared/custom.styles.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {
  public expenseForm: FormGroup = new FormGroup({})
  public hideExpenseForm: boolean = true;
  expenseColDef: ColDef[] = [
    { field: 'id', headerName: 'Expense Id' },
    { field: 'to', headerName: 'Given To' },
    {
      field: 'amount',
      headerName: 'Amount',
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$')
    },
    { field: 'date', headerName: 'Date' },
    { field: 'description', headerName: 'Description (Optional)' },
    {
      field: 'action',
      headerName: 'Action',
      editable: false,
      cellRenderer: ActionComponent
    }
  ]
  expenseRowData: Expense[] = [];
  expenseSubscription: Subscription = new Subscription;
  bsConfig?: Partial<BsDatepickerConfig>;
  agGridOptions: GridOptions = {
    domLayout: 'autoHeight',
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }

  constructor(
    public expenseService: ExpenseService,
    public util: UtilService
  ) {
    const date = new Date();
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-red',
      showWeekNumbers: false,
      minDate: new Date(date.getFullYear(), date.getMonth(), 1),
      maxDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    })
  }



  ngOnInit(): void {
    this.expenseForm = new FormGroup({
      to: new FormControl<string>('', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      amount: new FormControl<number>(0, [ Validators.required ]),
      description: new FormControl<string | null>('')
    });
    this.expenseRowData = this.expenseService.expenses;
    this.expenseService.monthlyExpense = this.util.calculateMonthlyTotal(this.expenseRowData);
    this.expenseSubscription = this.expenseService.expenseEvent.subscribe((updatedExpense: Expense[]) => {
      this.expenseRowData = updatedExpense;
    })    
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    this.expenseService.updateExpense(event?.data);
  }

  addExpense() {
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  onSubmit(): void {
    const payload = this.expenseForm.getRawValue();
    payload.date = payload.date.toLocaleDateString();
    this.expenseService.addExpense(payload);
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  ngOnDestroy(): void {
    this.expenseSubscription.unsubscribe();
  }
}
