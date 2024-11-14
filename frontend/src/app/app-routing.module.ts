// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },  // Default route to Dashboard
  // { path: '**', redirectTo: '', pathMatch: 'full' }  // Redirect unknown routes to Dashboard
  { path: '', component: LoginComponent },  // Default route to login page
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
