// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoachComponent } from './components/coach/coach.component';
import { HomeComponent } from './components/home/home.component';
import { DataComponent } from './components/data/data.component';


 const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'player-dashboard', component: DashboardComponent }, // Protected route
  { path: 'coach-dashboard', component: CoachComponent}, // Protected route
  { path: 'home',component: HomeComponent},
  { path: 'data' ,component:DataComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
