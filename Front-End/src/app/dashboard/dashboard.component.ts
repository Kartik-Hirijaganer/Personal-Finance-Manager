import { Component, OnInit } from "@angular/core";
import { AgChartOptions, PixelSize, AgChartTheme } from "ag-charts-community";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { switchMap } from "rxjs";

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";
import { DashboardService } from "./dashboard.service";
import { DownloadService } from "../shared/download.service";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";

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
    private downloadService: DownloadService,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
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
      // height: 270 as PixelSize,
      data: [],
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

    this.route.url.pipe(
      switchMap((event: UrlSegment[]) => {
        const userId = event[1]?.path;
        this.userService.userId = userId;
        return this.userService.getUser(userId);
      })
    ).subscribe((res: any) => {
      if (res.user) {
        this.userService.userEvent.next({ user_fname: res.user.fname, profile_img: res.user.profile_img, userId: res.user.userId })
        this.userService.user_fname = res.user?.fname;
        this.userService.profile_img = res.user?.profile_img;
      }
    })

    this.dashboardService.getChartData().subscribe(({ incomes, expenses, liabilities }) => {
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

  onAddManageAccount() {
    console.log('here');
    
  }
}