import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ColDef } from "ag-grid-community";

import { IncomeService } from './income.service';
import { Income } from './income.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit {
  incomeForm: FormGroup = new FormGroup({
    from: new FormControl<string>(''),
    date: new FormControl<string>(''),
    amount: new FormControl<number>(0)
  });
  incomeColDefs: ColDef[] = [
    { field: "payment_id", headerName: "Payment Id" },
    { field: "from", headerName: "Received From" },
    { field: "amount", headerName: "Amount ($)" },
    { field: "date" },
    { field: "description" }
  ];
  incomeRowData: Income[] = [];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    autoHeight: true
  }
  hideIncomeForm: boolean = true;
  incomeListSubscription: Subscription = new Subscription;

  constructor(private incomeService: IncomeService) { }

  ngOnInit() {
    this.incomeForm = new FormGroup({
      'from': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'amount': new FormControl(null, Validators.required),
      'description': new FormControl('', Validators.required)
    });
    this.incomeRowData = this.incomeService.getIncomeList();
    this.incomeListSubscription = this.incomeService.incomeListEvent.subscribe((updatedIncomeList: Income[]) => {
      this.incomeRowData = updatedIncomeList;
    })
  }

  toggleIncomeForm() {
    this.hideIncomeForm = !this.hideIncomeForm;
  }

  onSubmit() {
    const { from, date, amount, description } = this.incomeForm.getRawValue();
    this.incomeService.addIncomeEntry(from, date, amount, description);
    this.toggleIncomeForm();
  }
}
