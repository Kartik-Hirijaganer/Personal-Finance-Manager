import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { IncomeComponent } from "./income/income.component";
import { ExpenseComponent } from "./expense/expense.component";
import { LiabilityComponent } from "./liability/liability.component";
import { UserComponent } from "./user/user.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'incomes', component: IncomeComponent },
  { path: 'expenses', component: ExpenseComponent },
  { path: 'liabilities', component: LiabilityComponent},
  { path: 'users', component: UserComponent }
]

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }