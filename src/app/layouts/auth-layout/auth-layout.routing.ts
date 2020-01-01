import { Routes } from '@angular/router';

import { LoginComponent } from '../../auth/login/login.component';
import { ForgotComponent } from '../../auth/forgot/forgot.component';
import { ResetComponent } from '../../auth/reset/reset.component';

export const AuthLayoutRoutes: Routes = [
    { path: '',           component: LoginComponent },
    { path: 'login',      component: LoginComponent },
    { path: 'forgot',     component: ForgotComponent },
    { path: 'reset/:id',  component: ResetComponent },
];
