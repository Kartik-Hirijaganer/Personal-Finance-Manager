import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ColDef, GridReadyEvent, GridOptions, GridApi } from "ag-grid-community";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';

import { IncomeService } from './income.service';
import { Income } from './income.model';
import { ActionComponent } from '../shared/action/action.component';
import { UtilService } from '../shared/util.service'
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css', '../shared/custom.styles.css']
})
export class IncomeComponent implements OnInit, OnDestroy {
  incomeForm: FormGroup = new FormGroup({});
  incomeColDefs: ColDef[] = [
    {
      field: "id",
      headerName: "Invoice ID",
      editable: false
    },
    { field: "from", headerName: "Received From", editable: true },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$'),
      editable: true
    },
    { field: "date", headerName: "Date", editable: true },
    { field: "description", headerName: "Description", editable: true },
    {
      field: "Action",
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
  ];
  incomeRowData: Income[] = [];
  agGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      autoHeight: true
    }
  }
  public hideIncomeForm: boolean = true;
  private gridApi!: GridApi;
  bsConfig?: Partial<BsDatepickerConfig>;

  private incomeListSubscription: Subscription = new Subscription;
  private incomeRowSubscription: Subscription = new Subscription;
  private addIncomeSubscription: Subscription = new Subscription;
  private getIncomeSubscription: Subscription = new Subscription;

  constructor(
    public incomeService: IncomeService,
    private util: UtilService,
    private accountService: AccountService
  ) {
    const date = new Date();
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-green',
      showWeekNumbers: false,
      minDate: new Date(date.getFullYear(), date.getMonth(), 1),
      maxDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    })
  }

  ngOnInit() {
    this.initializeForm();
    const accountId = localStorage.getItem('account_id') || '';
    this.accountService.getAccountDetails(accountId).subscribe(account => {
      this.incomeRowData = account.incomes || [];
    });
    this.incomeRowSubscription = this.incomeService.incomeEditEvent.subscribe((event) => {
      this.handleIncomeEvent(event.action, event.idx, event?.payload);
    });
  }

  initializeForm() {
    this.incomeForm = new FormGroup({
      'from': new FormControl<string>('', Validators.required),
      'date': new FormControl<Date>(new Date(), Validators.required),
      'amount': new FormControl<number>(0, Validators.required),
      'description': new FormControl<string | null>('')
    });
  }

  handleIncomeEvent(action: string, idx: number, payload?: Income | null) {
    switch (action) {
      case 'edit':
        this.gridApi.setFocusedCell(idx, "from");
        this.gridApi.startEditingCell({ rowIndex: idx, colKey: "from" });
        break;
      case 'save':
        this.gridApi.stopEditing();
        this.incomeService.updateIncome(payload as Income).subscribe(res => {
          const tableData = this.util.getAllRows(this.gridApi);
          this.incomeService.monthlyIncome = this.util.calculateTotalAmount(tableData);
        });
        break;
      case 'delete':
        const { id } = payload as Income;
        this.incomeService.deleteIncome(id).subscribe(res => {
          this.gridApi?.applyTransaction({ remove: [payload] });
          const tableData = this.util.getAllRows(this.gridApi);
          this.incomeService.monthlyIncome = this.util.calculateTotalAmount(tableData);
        });
        break;
      default:
        break;
    }
  }

  addIncome(): void {
    this.hideIncomeForm = this.util.toggle(this.hideIncomeForm);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSubmit(): void {
    const payload = this.incomeForm.getRawValue();
    payload.date = payload.date.toLocaleDateString();
    this.addIncomeSubscription = this.incomeService.addIncome(payload).subscribe(({incomeId}) => {
      const newIncome = { ...payload, id: incomeId };
      this.gridApi.applyTransaction({ add: [newIncome] });
      const tableData = this.util.getAllRows(this.gridApi);
      this.incomeService.monthlyIncome = this.util.calculateTotalAmount(tableData);
      this.hideIncomeForm = this.util.toggle(this.hideIncomeForm);
      this.initializeForm();
    });
  }

  ngOnDestroy(): void {
    this.incomeListSubscription.unsubscribe();
    this.incomeRowSubscription.unsubscribe();
    this.addIncomeSubscription.unsubscribe();
    this.getIncomeSubscription.unsubscribe();
  }
}
