import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
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
      cellRenderer: ActionComponent
    }
  ]
  expenseRowData: Expense[] = [];
  private expenseSubscription: Subscription = new Subscription;
  private expenseRowSubscription: Subscription = new Subscription;
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
    this.initialize();
    this.expenseSubscription = this.expenseService.expenseEvent.subscribe((updatedExpense: Expense[]) => {
      this.expenseRowData = updatedExpense;
    })
    this.expenseRowSubscription = this.expenseService.expenseEditEvent.subscribe(({ action, idx, payload }) => {
      switch (action) {
        case 'edit':
          this.gridApi.setFocusedCell(idx, "to");
          this.gridApi.startEditingCell({ rowIndex: idx, colKey: "to" });
          break;
        case 'save':
          this.gridApi.stopEditing();
          this.expenseService.updateExpense(payload as Expense).subscribe(res => {
            const tableData = this.util.getAllRows(this.gridApi);
            this.expenseService.monthlyExpense = this.util.calculateTotalAmount(tableData);
          });
          break;
        case 'delete':
          const { id } = payload as Expense;
          this.expenseService.deleteExpense(id).subscribe(expenses => {
            this.expenseRowData = expenses;
          });
          break;
        default:
          break;
      }
    })
  }

  initialize(): void {
    this.expenseForm = new FormGroup({
      to: new FormControl<string>('', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      amount: new FormControl<number>(0, [Validators.required]),
      description: new FormControl<string | null>('')
    });

    this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenseRowData = expenses;
    });
  }

  addExpense(): void {
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onSubmit(): void {
    const payload = this.expenseForm.getRawValue();
    payload.date = payload.date.toLocaleDateString();
    this.expenseService.addExpense(payload).subscribe((expenses: Expense[]) => {
      this.expenseRowData = expenses;
    });
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  ngOnDestroy(): void {
    this.expenseSubscription.unsubscribe();
    this.expenseRowSubscription.unsubscribe();
  }
}
