import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, of } from 'rxjs';

import { ActionComponent } from '../shared/action/action.component';
import { Account } from './account.model';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['../shared/custom.styles.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  public accountForm: FormGroup = new FormGroup({});
  public enableForm: boolean = false;
  accountColDef: ColDef[] = [
    { field: 'accountNo', headerName: 'Account Number', editable: false },
    { field: 'accountSource', headerName: 'Account Source', editable: false },
    { field: 'description', headerName: 'Description', editable: false },
    {
      field: 'action',
      headerName: 'Action',
      cellRenderer: ActionComponent,
      cellRendererParams: {
        actions: {
          'delete': true,
          'edit': false,
          'select': true
        }
      },
      editable: false
    }
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
  private accountEvent: Subscription = new Subscription;
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      accountNo: new FormControl<string>('XXXXXXXXXX', [Validators.required, Validators.pattern(/^[0-9+]+$/)]),
      accountSource: new FormControl<string>('', Validators.required),
      description: new FormControl<string | null>('')
    })
    this.getAccountRowData();
    this.accountEvent = this.accountService.accountSelectEvent.subscribe(event => {
      this.gridApi.forEachNode(node => {
        if (node.data?.selected) {
          node.setData({ ...node.data, selected: false });
        }
        if (node.data?.accountNo && node.data?.accountNo === event.accountNo) {
          node.setData({ ...node.data, selected: true });
          localStorage.setItem('account_id', event.accountId);
        }
      })
    })
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  toggleForm() {
    this.enableForm = !this.enableForm;
  }

  getAccountRowData() {
    this.accountService.getAccounts().pipe(
      catchError(err => {
        const errorMessage: string = err?.error?.error?.errorMessage;
        const title: string = err?.error?.errorMessage;
        this.toastr.error(errorMessage, title);
        return of(null);
      })
    ).subscribe(accounts => {
      if (accounts) {
        this.accountRowData = this.setRowActionData(accounts);
      }
    })
  }

  setRowActionData(accounts: Account[]): Account[] {
    const accountsWithActionData = [];
    for (let i = 0; i < accounts.length; i++) {
      let selected: boolean = false;
      if (i === 0) {
        selected = true
      }
      accountsWithActionData.push({ ...accounts[i], selected });
    }
    return accountsWithActionData;
  }

  onSubmit() {
    const { accountNo, ...rest } = this.accountForm.getRawValue();
    const payload = {
      ...rest,
      accountNo: parseInt(accountNo)
    } as Account;
    this.accountService.addAccount(payload).pipe(
      catchError(err => {
        const errorMessage: string = err?.error?.error?.errorMessage;
        const title: string = err?.error?.errorMessage;
        this.toastr.error(errorMessage, title);
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        if (!localStorage.getItem('account_id')) {
          localStorage.setItem('account_id', res.accountId);
        }
        this.accountRowData = this.setRowActionData([...this.accountRowData, payload]);
        this.toastr.success('Added new account', 'Success');
        this.toggleForm();
      }
    });
  }

  ngOnDestroy() {
    this.accountEvent.unsubscribe();
  }
}