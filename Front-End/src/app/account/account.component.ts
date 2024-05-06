import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActionComponent } from '../shared/action/action.component';
import { Account } from './account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['../shared/custom.styles.css']
})
export class AccountComponent implements OnInit {
  public accountForm: FormGroup = new FormGroup({});
  public enableForm: boolean = false;
  accountColDef: ColDef[] = [
    { field: 'accountNo', headerName: 'Account Number', editable: false },
    { field: 'accountSource', headerName: 'Account Source', editable: false },
    { field: 'description', headerName: 'Description', editable: false },
    { field: 'action', headerName: 'Action', cellRenderer: ActionComponent, editable: false }
  ];
  accountRowData: Account[] = [];
  private gridApi!: GridApi;
  agGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }
  constructor() {}

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      accountNo: new FormControl<string>('XXXXXXXXXX', [Validators.required, Validators.pattern(/^[0-9+]+$/)]),
      accountSource: new FormControl<string>('', Validators.required),
      description: new FormControl<string | null>('')
    })
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  toggleForm() {
    this.enableForm = !this.enableForm;
  }

  onSubmit() {
    const { accountNo, ...rest } = this.accountForm.getRawValue();
    const payload = {
      ...rest,
      accountNo: parseInt(accountNo)
    }
    console.log(payload);
    
    this.toggleForm();
  }
}