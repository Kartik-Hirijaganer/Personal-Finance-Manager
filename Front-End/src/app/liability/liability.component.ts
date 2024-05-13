import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridReadyEvent, GridOptions, GridApi } from 'ag-grid-community';
import { Subscription, catchError, of } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { LiabilityService } from './liability.service';
import { UtilService } from '../shared/util.service';
import { Liability } from './liability.model';
import { ActionComponent } from '../shared/action/action.component';
import { AccountService } from '../account/account.service';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';

@Component({
  selector: 'app-liability',
  templateUrl: './liability.component.html',
  styleUrls: ['./liability.component.css', '../shared/custom.styles.css']
})
export class LiabilityComponent implements OnInit, OnDestroy {
  public liabilityForm: FormGroup = new FormGroup({})
  public hideLiabilityForm: boolean = true;
  liabilityColDef: ColDef[] = [
    { field: 'id', headerName: 'Liability ID', editable: false },
    { field: 'name', headerName: 'Liability', editable: true },
    {
      field: 'amount',
      headerName: 'Amount',
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$'),
      editable: true
    },
    { field: 'due_date', 
      headerName: 'Due Date', 
      editable: true,
      cellRenderer: DatePickerComponent,
      cellRendererParams: { data: { theme: 'red' } }
    },
    { field: 'description', headerName: 'Description', editable: true },
    {
      field: 'action',
      headerName: 'Action',
      editable: false,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        actions: {
          'delete': true,
          'edit': true,
          'select': false
        }
      }
    }
  ]
  liabilityRowData: Liability[] = [];
  private liabilityRowSubscription: Subscription = new Subscription;
  private accountSubscription: Subscription = new Subscription;
  private addIncomeSubscription: Subscription = new Subscription;
  private editLiabilitySubscription: Subscription = new Subscription;
  private deleteLiabilitySubscription: Subscription = new Subscription;

  private gridApi!: GridApi;
  bsConfig?: Partial<BsDatepickerConfig>;
  agGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }

  constructor(
    public liabilityService: LiabilityService,
    public util: UtilService,
    private accountService: AccountService,
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
        this.liabilityRowData = account.liabilities || [];
        this.liabilityService.monthlyLiability = this.util.calculateTotalAmount(account.liabilities);
      }
    });
    this.liabilityRowSubscription = this.liabilityService.liabilityEditEvent.subscribe((event) => {
      this.handleLiabilityEvent(event.action, event.idx, event?.payload);
    });
  }

  addLiability() {
    this.hideLiabilityForm = this.util.toggle(this.hideLiabilityForm);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  initializeForm() {
    this.liabilityForm = new FormGroup({
      id: new FormControl<number | null>(null),
      name: new FormControl<string>('', Validators.required),
      amount: new FormControl<number>(0, Validators.required),
      due_date: new FormControl<Date>(new Date(), Validators.required),
      description: new FormControl<string>('')
    });
  }

  handleLiabilityEvent(action: string, idx: number, payload?: Liability | null) {
    switch (action) {
      case 'edit':
        this.gridApi.setFocusedCell(idx, "name");
        this.gridApi.startEditingCell({ rowIndex: idx, colKey: "name" });
        break;
      case 'save':
        this.gridApi.stopEditing();
        this.editLiabilitySubscription = this.liabilityService.updateLiability(payload as Liability)
        .pipe(catchError(err => {
          const errorMessage: string = err?.error?.error?.errorMessage;
          this.toastr.error(errorMessage, 'Failed to edit liability');
          return of(null);
        }))
        .subscribe(res => {
          if (res) {
            const tableData = this.util.getAllRows(this.gridApi);
            this.liabilityService.monthlyLiability = this.util.calculateTotalAmount(tableData);
          }
        });
        break;
      case 'delete':
        this.deleteLiabilitySubscription = this.liabilityService.deleteLiability(payload?.id || '')
        .pipe(catchError(err => {
          const errorMessage: string = err?.error?.error?.errorMessage;
          this.toastr.error(errorMessage, 'Failed to delete liability');
          return of(null);
        }))
        .subscribe(res => {
          if (res) {
            this.gridApi?.applyTransaction({ remove: [payload] });
            const tableData = this.util.getAllRows(this.gridApi);
            this.liabilityService.monthlyLiability = this.util.calculateTotalAmount(tableData);
          }
        });
        break;
      default:
        break;
    }
  }

  onSubmit(): void {
    const payload = this.liabilityForm.getRawValue();
    payload.due_date = payload.due_date.toLocaleDateString();
    this.addIncomeSubscription = this.liabilityService.addLiability(payload)
    .pipe(catchError(err => {
      const errorMessage: string = err?.error?.error?.errorMessage;
      this.toastr.error(errorMessage, 'Failed to add liability');
      return of(null);
    }))
    .subscribe(response => {
      if (response?.liabilityId) {
        const newLiability = { ...payload, id: response.liabilityId };
        this.gridApi.applyTransaction({ add: [newLiability] });
        const tableData = this.util.getAllRows(this.gridApi);
        this.liabilityService.monthlyLiability = this.util.calculateTotalAmount(tableData);
        this.initializeForm();
        this.hideLiabilityForm = this.util.toggle(this.hideLiabilityForm);
      }
    });
  }

  ngOnDestroy(): void {
    this.liabilityRowSubscription.unsubscribe();
    this.addIncomeSubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.deleteLiabilitySubscription.unsubscribe();
    this.editLiabilitySubscription.unsubscribe();
  }
}
