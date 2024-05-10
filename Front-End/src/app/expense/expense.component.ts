import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription, catchError, of } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { ExpenseService } from './expense.service';
import { UtilService } from '../shared/util.service';
import { Expense } from './expense.model';
import { ActionComponent } from '../shared/action/action.component';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css', '../shared/custom.styles.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {
  public expenseForm: FormGroup = new FormGroup({})
  public hideExpenseForm: boolean = true;
  private gridApi!: GridApi;
  expenseColDef: ColDef[] = [
    { field: 'id', headerName: 'Payment ID', editable: false },
    { field: 'to', headerName: 'Given To', colId: 'to', editable: true },
    {
      field: 'amount',
      headerName: 'Amount',
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$'),
      editable: true
    },
    { field: 'date', headerName: 'Date', editable: true },
    { field: 'description', headerName: 'Description', editable: true },
    {
      field: 'action',
      headerName: 'Action',
      editable: false,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        actions : {
          'delete': true,
          'edit': true,
          'select': false
        }
      }
    }
  ]
  expenseRowData: Expense[] = [];
  private accountSubscription: Subscription = new Subscription;
  private expenseRowSubscription: Subscription = new Subscription;
  private addExpenseSubscription: Subscription = new Subscription;
  private editExpenseSubscription: Subscription = new Subscription;
  private deleteExpenseSubscription: Subscription = new Subscription;

  bsConfig?: Partial<BsDatepickerConfig>;
  agGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }

  constructor(
    public expenseService: ExpenseService,
    public util: UtilService,
    public accountService: AccountService,
    private toastr: ToastrService
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
    this.initializeForm();
    const accountId: string = localStorage.getItem('account_id') || '';
    this.accountSubscription = this.accountService.getAccountDetails(accountId)
    .pipe(catchError(err => {
      const errorMessage: string = err?.error?.error?.errorMessage;
      this.toastr.error(errorMessage, 'Failed to fetch data');
      return of(null);
    }))
    .subscribe(account => {
      if (account) {
        this.expenseRowData = account.expenses || [];
        this.expenseService.monthlyExpense = this.util.calculateTotalAmount(account.expenses);
      }
    });
    this.expenseRowSubscription = this.expenseService.expenseEditEvent.subscribe((event) => {
      this.handleExpenseEvent(event.action, event.idx, event?.payload);
    });
  }

  addExpense(): void {
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  initializeForm() {
    this.expenseForm = new FormGroup({
      to: new FormControl<string>('', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      amount: new FormControl<number>(0, [Validators.required]),
      description: new FormControl<string | null>('')
    });
  }

  handleExpenseEvent(action: string, idx: number, payload?: Expense | null) {
    switch (action) {
      case 'edit':
        this.gridApi.setFocusedCell(idx, "to");
        this.gridApi.startEditingCell({ rowIndex: idx, colKey: "to" });
        break;
      case 'save':
        this.gridApi.stopEditing();
        this.editExpenseSubscription = this.expenseService.updateExpense(payload as Expense)
        .pipe(catchError(err => {
          const errorMessage: string = err?.error?.error?.errorMessage;
          this.toastr.error(errorMessage, 'Failed to update expense');
          return of(null);
        }))
        .subscribe(res => {
          if (res) {
            const tableData = this.util.getAllRows(this.gridApi);
            this.expenseService.monthlyExpense = this.util.calculateTotalAmount(tableData);
          }
        });
        break;
      case 'delete':
        const { id } = payload as Expense;
        this.deleteExpenseSubscription = this.expenseService.deleteExpense(id)
        .pipe(catchError(err => {
          const errorMessage: string = err?.error?.error?.errorMessage;
          this.toastr.error(errorMessage, 'Failed to delete expense');
          return of(null);
        }))
        .subscribe(res => {
          if (res) {
            this.gridApi?.applyTransaction({ remove: [payload] });
            const tableData = this.util.getAllRows(this.gridApi);
            this.expenseService.monthlyExpense = this.util.calculateTotalAmount(tableData);
          }
        });
        break;
      default:
        break;
    }
  }

  onSubmit(): void {
    const payload = this.expenseForm.getRawValue();
    payload.date = payload.date.toLocaleDateString();
    this.addExpenseSubscription = this.expenseService.addExpense(payload)
    .pipe(catchError(err => {
      const errorMessage: string = err?.error?.error?.errorMessage;
      this.toastr.error(errorMessage, 'Failed to add expense');
      return of(null);
    }))
    .subscribe((response) => {
      if (response?.expenseId) {
        const newExpense = { ...payload, id: response.expenseId };
        this.gridApi.applyTransaction({ add: [newExpense] });
        const tableData = this.util.getAllRows(this.gridApi);
        this.expenseService.monthlyExpense = this.util.calculateTotalAmount(tableData);
        this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
        this.initializeForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.expenseRowSubscription.unsubscribe();
    this.addExpenseSubscription.unsubscribe();
    this.editExpenseSubscription.unsubscribe();
    this.deleteExpenseSubscription.unsubscribe();
  }
}
