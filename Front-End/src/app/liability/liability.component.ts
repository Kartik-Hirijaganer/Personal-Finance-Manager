import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, RowValueChangedEvent, GridOptions } from 'ag-grid-community';
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
    { field: 'id', headerName: 'Liability ID' },
    { field: 'name', headerName: 'Liability' },
    {
      field: 'amount',
      headerName: 'Amount',
      valueFormatter: params => this.util.currencyFormatter(params.data.amount, '$')
    },
    { field: 'due_date', headerName: 'Due Date' },
    { field: 'description', headerName: 'Description (Optional)' },
    {
      field: 'action',
      headerName: 'Action',
      editable: false,
      cellRenderer: ActionComponent
    }
  ]
  liabilityRowData: Liability[] = [];
  liabilitySubscription: Subscription = new Subscription;
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
    this.liabilityForm = new FormGroup({
      id: new FormControl<number | null>(null),
      name: new FormControl<string>('', Validators.required),
      amount: new FormControl<number>(0, Validators.required),
      due_date: new FormControl<Date>(new Date(), Validators.required),
      description: new FormControl<string>('')
    });
    this.liabilityRowData = this.liabilityService.liabilities;
    console.log(this.liabilityRowData);
    
    this.liabilityService.monthlyLiability = this.util.calculateMonthlyTotal(this.liabilityRowData);
    this.liabilitySubscription = this.liabilityService.liabilityEvent.subscribe((updatedLiability: Liability[]) => {
      this.liabilityRowData = updatedLiability;
    })
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    this.liabilityService.updateLiability(event?.data);
  }

  addLiability() {
    this.hideLiabilityForm = this.util.toggle(this.hideLiabilityForm);
  }

  onSubmit(): void {
    const payload = this.liabilityForm.getRawValue();
    payload.date = payload.date.toLocaleDateString();
    this.liabilityService.addLiability(payload);
    this.hideLiabilityForm = this.util.toggle(this.hideLiabilityForm);
  }

  ngOnDestroy(): void {
    this.liabilitySubscription.unsubscribe();
  }
}
