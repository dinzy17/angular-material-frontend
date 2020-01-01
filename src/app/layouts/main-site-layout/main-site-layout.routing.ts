import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component'

export const MainSiteLayoutRoutes: Routes = [
    { path: '',      component: HomeComponent },
    { path: 'home',      component: HomeComponent },
];
