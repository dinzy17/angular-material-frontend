import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { LoginComponent } from '../../auth/login/login.component';
import { ForgotComponent } from '../../auth/forgot/forgot.component';
import { ResetComponent } from '../../auth/reset/reset.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatCardModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoginComponent,
    ForgotComponent,
    ResetComponent
  ],
  
})

export class AuthLayoutModule {}
