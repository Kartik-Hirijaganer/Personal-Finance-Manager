import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

import { ActionComponent } from '../shared/action/action.component';
import { Account } from './account.model';
import { AccountService } from './account.service';

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
  accountRowData: any[] = [];
  private gridApi!: GridApi;
  agGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      accountNo: new FormControl<string>('XXXXXXXXXX', [Validators.required, Validators.pattern(/^[0-9+]+$/)]),
      accountSource: new FormControl<string>('', Validators.required),
      description: new FormControl<string | null>('')
    })
    this.accountRowData = [
      {
        accountNo: 111111111,
        "accountSource": "Salary",
        "description": "Savings account",
        selected: true
      }, {
        accountNo: 222222222,
        "accountSource": "Salary",
        "description": "Savings account",
        selected: false
      }, {
        accountNo: 333333333,
        "accountSource": "Salary",
        "description": "Savings account",
        selected: false
      }
    ]
    this.accountService.accountSelectEvent.subscribe(event => {
      this.gridApi.forEachNode(node => {
        if (node.data?.selected) {
          node.setData({ ...node.data, selected: false });
        }
        if (node.data?.accountNo === event.accountNo) {
          node.setData({ ...node.data, selected: true });
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

  onSubmit() {
    const { accountNo, ...rest } = this.accountForm.getRawValue();
    const payload = {
      ...rest,
      accountNo: parseInt(accountNo)
    } as Account;
    this.accountService.addAccount(payload).pipe(
      catchError(err => {
        const errorMessage: string = err;
        this.toastr.error(`Failed to save account details. ${errorMessage}`, 'error');
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        if (!localStorage.getItem('accountId')) {
          localStorage.setItem('accountId', res.accountId);
        }
        this.accountRowData.push(payload);
        this.toggleForm();
        this.toastr.success('Added new account', 'Success');
      }
    });
  }
}