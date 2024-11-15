// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';  // Import RouterModule

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AppRoutingModule } from './app-routing.module';  // Import AppRoutingModule
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import { PlayerFormComponent } from './player-form/player-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoachComponent } from './components/coach/coach.component';

  // Import AppRoutingModule

@NgModule({
  providers: [DatePipe],
  declarations: [
   
    AppComponent,
    DashboardComponent,

    LoginComponent,
    RegisterComponent,
    // PlayerFormComponent,
    CoachComponent

  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,  // Include AppRoutingModule

    RouterModule  ,
    ReactiveFormsModule,
    FormsModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}