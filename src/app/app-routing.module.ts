import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { SearchuserComponent } from './searchuser/searchuser.component';
import { AddprojectComponent } from './addproject/addproject.component';

import { ViewprojectComponent } from './viewproject/viewproject.component';
import { ConnectionComponent } from './connection/connection.component';
import { from } from 'rxjs';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: SearchuserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project',
    component: AddprojectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:id',
    component: ViewprojectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'network',
    component: ConnectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
