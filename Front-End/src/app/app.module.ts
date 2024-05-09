import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { AgChartsAngular } from 'ag-charts-angular';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './expense/expense.component';
import { IncomeComponent } from './income/income.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LiabilityComponent } from './liability/liability.component';
import { ActionComponent } from './shared/action/action.component';
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth/auth.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmationPopupComponent } from './shared/confirmation-modal/confirmation-modal-component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    IncomeComponent,
    ExpenseComponent,
    LiabilityComponent,
    ActionComponent,
    UserComponent,
    AuthComponent,
    FooterComponent,
    ConfirmationPopupComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    AgChartsAngular,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
