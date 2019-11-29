import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ImplantsComponent } from '../../implants/implants.component';
import { AnalyzeComponent } from '../../analyze/analyze.component';
import { UsersComponent } from '../../users/users.component';
import { AdminGuard } from 'app/admin.guard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ConfirmModelComponent } from 'app/confirm-model/confirm-model.component';
import { UserDetailComponent } from 'app/users/user-detail/user-detail.component';
import { CMSComponent } from 'app/cms/cms.component';


import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatTabsModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ImageCropperModule,
    MatDialogModule,
    MatTabsModule
  ],
  entryComponents: [ ConfirmModelComponent, UserDetailComponent ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    ImplantsComponent,
    AnalyzeComponent,
    UsersComponent,
    ConfirmModelComponent,
    UserDetailComponent,
    CMSComponent
  ],
  providers: [ AdminGuard ],
})

export class AdminLayoutModule {}
