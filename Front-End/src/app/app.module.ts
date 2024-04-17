import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './expense/expense.component';
import { IncomeComponent } from './income/income.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LiabilityComponent } from './liability/liability.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    IncomeComponent,
    ExpenseComponent,
    LiabilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
