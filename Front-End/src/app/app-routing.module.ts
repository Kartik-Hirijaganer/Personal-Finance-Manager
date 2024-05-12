import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { IncomeComponent } from "./income/income.component";
import { ExpenseComponent } from "./expense/expense.component";
import { LiabilityComponent } from "./liability/liability.component";
import { UserComponent } from "./user/user.component";
import { AuthComponent } from "./auth/auth.component";
import { AccountComponent } from "./account/account.component";
import { AuthGuard } from './auth/auth-gaurd';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'incomes', component: IncomeComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: 'liabilities', component: LiabilityComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }