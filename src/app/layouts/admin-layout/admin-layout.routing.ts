import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ImplantsComponent } from '../../implants/implants.component';
import { AnalyzeComponent } from '../../analyze/analyze.component';
import { CMSComponent } from '../../cms/cms.component';
import { UsersComponent } from '../../users/users.component';
import { AdminGuard } from 'app/admin.guard';
import { SupportsComponent } from 'app/supports/supports.component';
import { ImplantsListComponent } from 'app/implants/implants-list/implants-list.component';
import { ImplantsDetailsComponent } from 'app/implants/implants-details/implants-details.component';

export const AdminLayoutRoutes: Routes = [
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
    {
        path: 'analyze',
        component: AnalyzeComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'supports',
        component: SupportsComponent
    },
    {
        path: 'cms',
        component: CMSComponent
    },
    {
        path: 'implant-list',
        component: ImplantsListComponent
    },
    {
        path: 'implant-view/:id',
        component: ImplantsDetailsComponent
    }
];
