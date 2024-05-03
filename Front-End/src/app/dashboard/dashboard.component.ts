import { Component, OnInit } from "@angular/core";
import { AgChartOptions, PixelSize, AgChartTheme } from "ag-charts-community";

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";
import { DashboardService } from "./dashboard.service";
import { DownloadService } from "../shared/download.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public chartOptions: AgChartOptions;
  public showShadow: boolean = false;
  public currentBalance: number = 0;

  constructor(
    public expenseService: ExpenseService,
    public incomeService: IncomeService,
    public liabilityService: LiabilityService,
    private dashboardService: DashboardService,
    private downloadService: DownloadService
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
      data: [ ],
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'month', yKey: 'expense', yName: 'Expense', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'liability', yName: 'Liability', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'income', yName: 'Income', stacked: false }
      ]
    };
  }

  ngOnInit() {
    this.incomeService.monthlyIncomeEvent.subscribe((incomeAmount: number) => {
      this.currentBalance -= incomeAmount;
    })
    this.liabilityService.monthlyLiabilityEvent.subscribe((liabilityAmount: number) => {
      this.currentBalance -= liabilityAmount;
    })
    this.expenseService.monthlyExpenseEvent.subscribe((expenseAmount: number) => {
      this.currentBalance -= expenseAmount;
    })

    this.dashboardService.getChartData().subscribe(({incomes, expenses, liabilities}) => {
      const data = this.dashboardService.constructChartData(incomes, expenses, liabilities);
      this.setChartOptions({ data });
    });
  }

  setChartOptions(currentOptions: any) {
    this.chartOptions = {
      ...this.chartOptions,
      ...currentOptions
    }
  }

  downloadPdf() {
    this.dashboardService.getChartData().subscribe((response) => {
      this.downloadService.generatePdf(response);
    });
  }
}