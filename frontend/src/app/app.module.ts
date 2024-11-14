// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';  // Import RouterModule

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { CoachComponent } from './components/coach/coach.component';
import { ReactiveFormsModule } from '@angular/forms';
  // Import AppRoutingModule

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CoachComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,  // Include AppRoutingModule
    RouterModule ,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
