// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoachComponent } from './components/coach/coach.component';


 const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'player-dashboard', component: DashboardComponent }, // Protected route
  { path: 'coach-dashboard', component: CoachComponent}, // Protected route
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
