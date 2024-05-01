import { Component } from "@angular/core";
import { AgChartOptions, PixelSize, AgChartTheme } from "ag-charts-community";

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public chartOptions: AgChartOptions;
  public showShadow: boolean = false;

  constructor(
    public expenseService: ExpenseService,
    public incomeService: IncomeService,
    public liabilityServie: LiabilityService
  ) {
    this.chartOptions = {
      theme: {
        baseTheme: "ag-default",
        palette: {
          fills: ["#F32013", "#ffa500", "#85bb65"],
        }
      } as AgChartTheme,
      // Data: Data to be displayed in the chart
      title: { text: '6 Months Cash Flow' },
      height: 270 as PixelSize,
      data: [
        { month: 'Jan', expense: 20000, liability: 10000, income: 120000, balance: 20000 },
        { month: 'Feb', expense: 12000, liability: 10000, income: 120000, balance: 22000 },
        { month: 'Mar', expense: 50000, liability: 10000, income: 120000, balance: 25000 },
        { month: 'Apr', expense: 76000, liability: 10000, income: 120000, balance: 120000 },
        { month: 'May', expense: 15000, liability: 10000, income: 120000, balance: 10000 },
        { month: 'Jun', expense: 20000, liability: 10000, income: 120000, balance: 10500 },
      ],
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'month', yKey: 'expense', yName: 'Expense', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'liability', yName: 'Liability', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'income', yName: 'Income', stacked: false }
      ]
    };
  }
}