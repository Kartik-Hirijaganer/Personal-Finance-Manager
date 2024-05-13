import { Component, OnInit } from "@angular/core";
import { AgChartOptions, AgChartTheme } from "ag-charts-community";
import { Router } from "@angular/router";
import { switchMap, of, catchError } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from "./dashboard.service";
import { DownloadService } from "../shared/download.service";
import { UserService } from "../user/user.service";
import { AccountService } from "../account/account.service";
import { Expense } from "../expense/expense.model";
import { Liability } from "../liability/liability.model";
import { Income } from "../income/income.model";
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
  public noAccountExist: boolean = false;
  private userId: string = '';
  private accountId: string = '';
  public monthlyIncome: number = 0;
  public monthlyExpense: number = 0;
  public monthlyLiability: number = 0;
  private accountNo: number = 0;
  private userFullName: string = '';

  constructor(
    private dashboardService: DashboardService,
    private downloadService: DownloadService,
    private router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.chartOptions = {
      theme: {
        baseTheme: "ag-default",
        palette: {
          fills: ["#85bb65", "#F32013", "#ffa500"],
        }
      } as AgChartTheme,
      // Data: Data to be displayed in the chart
      title: { text: '6 Months Cash Flow' },
      // height: 270 as PixelSize,
      data: [],
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'month', yKey: 'income', yName: 'Income', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'expense', yName: 'Expense', stacked: false },
        { type: 'bar', xKey: 'month', yKey: 'liability', yName: 'Liability', stacked: false }
      ]
    };
  }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id') || '';
    this.accountId = localStorage.getItem('account_id') || '';
    this.userService.getUser(this.userId).pipe(
      switchMap((res) => {
        if (res.user) {
          this.userFullName = `${res.user?.fname} ${res.user?.lname}`;
          this.userService.userEvent.next({ user_fname: res.user.fname, profile_img: res.user.profile_img, userId: res.user.userId })
          this.userService.user_fname = res.user?.fname;
          this.userService.profile_img = res.user?.profile_img;
        }
        if (!this.accountId) {
          return of(null);
        }
        return this.accountService.getAccountDetails(this.accountId);
      }),
      catchError(err => {
        const errorMessage: string = err?.error?.error?.errorMessage;
        this.toastr.error(errorMessage || 'Failed to fetch data', 'Unknown error');
        return of({ error: null });
      })
    ).subscribe((res: any) => {
      if (!res) {
        this.noAccountExist = true;
        this.toastr.error('Not account found. Please add an account.');
      }

      if (!res?.error) {
        this.accountNo = res.accountNo;
        this.setDashboardData(res.incomes, res.expenses, res.liabilities);
      }
    });
  }

  setDashboardData(incomes: Income[], expenses: Expense[], liabilities: Liability[]) {
    this.monthlyIncome = this.dashboardService.calculateMonthlyTotal(incomes);
    this.monthlyExpense = this.dashboardService.calculateMonthlyTotal(expenses);
    this.monthlyLiability = this.dashboardService.calculateMonthlyTotal(liabilities);
    this.currentBalance = this.monthlyIncome - (this.monthlyExpense + this.monthlyLiability);

    this.chartOptions = {
      ...this.chartOptions,
      data: this.dashboardService.generateChartData(incomes, expenses, liabilities)
    }
  }

  downloadPdf() {
    this.downloadService.generatePdf(this.chartOptions.data, this.monthlyIncome, this.monthlyExpense, this.monthlyLiability, {userName: this.userFullName, accountNo: this.accountNo});
  }

  onAddManageAccount() {
    this.router.navigate(['../accounts']);
  }
}