import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, RowValueChangedEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';

import { ExpenseService } from './expense.service';
import { UtilService } from '../shared/util.service';
import { Expense } from './expense.model';
import { DeleteEditButtonComponent } from '../shared/delete-edit-button.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css', '../shared/custom.styles.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {
  public expenseForm: FormGroup = new FormGroup({})
  public hideExpenseForm: boolean = true;
  expenseColDef: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'to', headerName: 'Given To'},
    { field: 'amount', headerName: 'Amount' },
    { field: 'date', headerName: 'Date' },
    { field: 'description', headerName: 'Description (Optional)' },
    { field: 'action', 
      headerName: 'Action', 
      editable: false,
      cellRenderer: DeleteEditButtonComponent
    }
  ]
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    autoHeight: true
  }
  expenseRowData: Expense[] = [];
  expenseSubscription: Subscription = new Subscription;



  constructor( 
    public expenseService: ExpenseService,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.expenseService.monthlyExpense = this.expenseService.calculateMonthlyExpense();
    this.expenseForm = new FormGroup({
      id: new FormControl<number | null>(null),
      to: new FormControl<string>('', Validators.required),
      date: new FormControl<string>('', Validators.required),
      amount: new FormControl<number>(0, Validators.required),
      description: new FormControl<string>('')
    });
    this.expenseRowData = this.expenseService.expenses;
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
    this.expenseService.addExpense(payload);
    this.hideExpenseForm = this.util.toggle(this.hideExpenseForm);
  }

  ngOnDestroy(): void {
    this.expenseSubscription.unsubscribe();
  }
}
