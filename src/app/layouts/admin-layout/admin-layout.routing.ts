import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ImplantsComponent } from '../../implants/implants.component';
import { AdminGuard } from 'app/admin.guard';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'implants',
        component: ImplantsComponent
    },

];
