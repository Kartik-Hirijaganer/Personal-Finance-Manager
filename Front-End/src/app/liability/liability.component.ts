import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridReadyEvent, GridOptions, GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { LiabilityService } from './liability.service';
import { UtilService } from '../shared/util.service';
import { Liability } from './liability.model';
import { ActionComponent } from '../shared/action/action.component';

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
    { field: 'due_date', headerName: 'Due Date', editable: true },
    { field: 'description', headerName: 'Description', editable: true },
    {
      field: 'action',
      headerName: 'Action',
      editable: false,
      cellRenderer: ActionComponent
    }
  ]
  liabilityRowData: Liability[] = [];
  private liabilitySubscription: Subscription = new Subscription;
  private liabilityRowSubscription: Subscription = new Subscription;
  private liabilityListSubscription: Subscription = new Subscription;
  private addIncomeSubscription: Subscription = new Subscription;

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
    this.initializeForm();
    this.liabilityService.getLiabilities().subscribe((liabilities: Liability[]) => {
      this.liabilityRowData = liabilities;
    });

    this.liabilityListSubscription = this.liabilityService.liabilityListEvent.subscribe((updatedLiabilityList: Liability[]) => {
      this.liabilityRowData = updatedLiabilityList;
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
        this.liabilityService.updateLiability(payload as Liability).subscribe(res => {
          const tableData = this.util.getAllRows(this.gridApi);
          this.liabilityService.monthlyLiability = this.util.calculateTotalAmount(tableData);
        });
        break;
      case 'delete':
        const { id } = payload as Liability;
        this.liabilityService.deleteLiability(id).subscribe(liabilities => {
          this.liabilityRowData = liabilities;
        });
        break;
      default:
        break;
    }
  }

  onSubmit(): void {
    const payload = this.liabilityForm.getRawValue();
    payload.due_date = payload.due_date.toLocaleDateString();
    this.addIncomeSubscription = this.liabilityService.addLiability(payload).subscribe((incomes: Liability[]) => {
      this.liabilityRowData = incomes;
    });;
    this.hideLiabilityForm = this.util.toggle(this.hideLiabilityForm);
  }

  ngOnDestroy(): void {
    this.liabilitySubscription.unsubscribe();
    this.liabilityRowSubscription.unsubscribe();
    this.liabilityListSubscription.unsubscribe();
    this.addIncomeSubscription.unsubscribe();
  }
}
