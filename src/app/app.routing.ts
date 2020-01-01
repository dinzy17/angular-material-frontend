import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainSiteLayoutComponent } from './layouts/main-site-layout/main-site-layout.component';

const routes: Routes =[
  {
    path: 'admin-auth',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
    }]
  }, {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  }, {
    path: '',
    component: MainSiteLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/main-site-layout/main-site-layout.module#MainSiteLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
