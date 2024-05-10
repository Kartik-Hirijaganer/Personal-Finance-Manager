import { Component, OnInit } from "@angular/core";
import { AgChartOptions, AgChartTheme } from "ag-charts-community";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap, of, catchError } from "rxjs";
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from "./dashboard.service";
import { DownloadService } from "../shared/download.service";
import { UserService } from "../user/user.service";
import { AccountService } from "../account/account.service";
import { Expense } from "../expense/expense.model";
import { Liability } from "../liability/liability.model";
import { Income } from "../income/income.model";

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

  constructor(
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
    this.route.queryParamMap.pipe(
      switchMap(({ params }: any) => {
        this.userId = params['userId'];
        this.accountId = params['accountId'];
        return this.userService.getUser(this.userId);
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
        this.setDashboardData(res.incomes, res.expenses, res.liabilities);
      }
    });
  }

  setDashboardData(incomes: Income[], expenses: Expense[], liabilities: Liability[]) {
    this.monthlyIncome = this.dashboardService.calculateMonthlyTotal(incomes);
    this.monthlyExpense = this.dashboardService.calculateMonthlyTotal(expenses);
    this.monthlyLiability = this.dashboardService.calculateMonthlyTotal(liabilities);
    this.currentBalance = this.monthlyIncome - (this.monthlyExpense + this.monthlyLiability);

    const data = this.dashboardService.constructChartData(incomes, expenses, liabilities);
    this.setChartOptions({ data });
  }

  setChartOptions(currentOptions: any) {
    this.chartOptions = {
      ...this.chartOptions,
      ...currentOptions
    }
  }

  downloadPdf() {
    // this.dashboardService.getChartData().subscribe((response) => {
    //   this.downloadService.generatePdf(response);
    // });
  }

  onAddManageAccount() {
    this.router.navigate(['../accounts'], { queryParams: { accountId: this.accountId, userId: this.userId } });
  }
}