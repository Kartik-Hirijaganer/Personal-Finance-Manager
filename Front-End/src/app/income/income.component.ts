import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ColDef, RowValueChangedEvent } from "ag-grid-community";
import { Subscription } from 'rxjs';

import { IncomeService } from './income.service';
import { Income } from './income.model';
import { DeleteEditButtonComponent } from '../shared/delete-edit-button.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css', '../shared/custom.styles.css']
})
export class IncomeComponent implements OnInit, OnDestroy {
  incomeForm: FormGroup = new FormGroup({});
  incomeColDefs: ColDef[] = [
    { field: "id", 
      headerName: "Payment Id"
    },
    { field: "from", headerName: "Received From" },
    { field: "amount", headerName: "Amount ($)" },
    { field: "date" },
    { field: "description" },
    { field: "Action", 
      editable: false,
      cellRenderer: DeleteEditButtonComponent
     }
  ];
  incomeRowData: Income[] = [];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    autoHeight: true,
    editable: true,
    headerClass: "ag-center-aligned-header"
  }
  hideIncomeForm: boolean = true;
  incomeListSubscription: Subscription = new Subscription;

  constructor(public incomeService: IncomeService) { }

  ngOnInit() {
    this.incomeForm = new FormGroup({
      'from': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'amount': new FormControl(null, Validators.required),
      'description': new FormControl('', Validators.required)
    });
    this.incomeRowData = this.incomeService.getIncomeList();
    this.incomeService.monthly_income = this.incomeService.calculateMonthlyIncome(this.incomeRowData);
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
