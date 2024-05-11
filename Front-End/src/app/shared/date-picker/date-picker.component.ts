import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent implements ICellRendererAngularComp {
  public bsConfig?: Partial<BsDatepickerConfig>;
  public value: any = new Date();

  constructor () {
    const date = new Date();
    this.bsConfig = {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      minDate: new Date(date.getFullYear(), date.getMonth(), 1),
      maxDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    if (params.data?.theme) {
      this.bsConfig = {
        ...this.bsConfig,
        containerClass: `theme-${params.data.theme}`
      }
    }
    if (params?.data?.date) {
      this.value = new Date(params.data.date);
    }
    if (params?.data?.due_date) {
      this.value = new Date(params.data.due_date);
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

}