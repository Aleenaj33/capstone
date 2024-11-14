// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CoachComponent } from './components/coach/coach.component';


  const routes: Routes = [
    { path: '', component: CoachComponent },  // Default route to Dashboard
    { path: '**', redirectTo: '', pathMatch: 'full' }  // Redirect unknown routes to Dashboard
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
