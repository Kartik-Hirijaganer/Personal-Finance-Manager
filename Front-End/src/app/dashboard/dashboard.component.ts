import { Component, OnInit } from "@angular/core";
import { AgChartOptions, PixelSize, AgChartTheme } from "ag-charts-community";
import { ActivatedRoute, Route, Router, UrlSegment } from "@angular/router";
import { switchMap, of } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { ExpenseService } from "../expense/expense.service";
import { IncomeService } from "../income/income.service";
import { LiabilityService } from "../liability/liability.service";
import { DashboardService } from "./dashboard.service";
import { DownloadService } from "../shared/download.service";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/user.model";
import { AccountService } from "../account/account.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public chartOptions: AgChartOptions;
  public showShadow: boolean = false;
  public currentBalance: number = 0;
  public noAccountExist: boolean = false;
  private userId: string = '';
  private accountId: string = '';

  constructor(
    public expenseService: ExpenseService,
    public incomeService: IncomeService,
    public liabilityService: LiabilityService,
    private dashboardService: DashboardService,
    private downloadService: DownloadService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private toastr: ToastrService
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
    this.route.queryParamMap.pipe(
      switchMap(({ params }: any) => {
        this.userId = params['userId'];
        this.accountId = params['accountId'];
        return this.userService.getUser(this.accountId);
      }),
      switchMap((res: any) => {
        if (res.user) {
          this.userService.userEvent.next({ user_fname: res.user.fname, profile_img: res.user.profile_img, userId: res.user.userId })
          this.userService.user_fname = res.user?.fname;
          this.userService.profile_img = res.user?.profile_img;
        }
        if (!this.accountId) {
          return of(null);
        }
        return this.accountService.getAccountDetails(this.accountId);
      })
    ).subscribe((res: any) => {
      if (!res) {
        this.noAccountExist = true;
        this.toastr.error('Not account found. Please add an account.');
      }
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
    this.router.navigate(['../accounts'], { queryParams: { accountId: this.accountId, userId: this.userId } });
  }
}