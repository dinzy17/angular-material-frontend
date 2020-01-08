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
//import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';
import { SupportsComponent } from 'app/supports/supports.component';
import { SupportEditComponent } from 'app/supports/support-edit/support-edit.component';
import { ImplantsListComponent } from 'app/implants/implants-list/implants-list.component';
import { ImplantsDetailsComponent } from 'app/implants/implants-details/implants-details.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MachineLearningComponent } from 'app/implants/machine-learning/machine-learning.component';
import { ImplantAppTestComponent } from 'app/implant-app-test/implant-app-test.component';
import { ImplantsEditComponent } from 'app/implants/implants-edit/implants-edit.component';
import { AddImageImplantComponent } from 'app/implants/add-image-implant/add-image-implant.component';
import { ImageViewComponent } from 'app/implants/image-view/image-view.component';
import { ImplantVerificationComponent } from 'app/implant-verification/implant-verification.component';
import { ImplantVerificationViewComponent } from 'app/implant-verification/implant-verification-view/implant-verification-view.component';

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
  MatTabsModule,
  MatProgressSpinnerModule
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
    MatTabsModule,
    MatProgressSpinnerModule,
    CKEditorModule
  ],
  entryComponents: [ ConfirmModelComponent, UserDetailComponent, SupportEditComponent, AddImageImplantComponent, ImageViewComponent], //SidLoderComponentComponent,
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    ImplantsComponent,
    AnalyzeComponent,
    UsersComponent,
    ConfirmModelComponent,
    UserDetailComponent,
    //SidLoderComponentComponent,
    SupportsComponent,
    CMSComponent,
    SupportEditComponent,
    ImplantsListComponent,
    ImplantsDetailsComponent,
    MachineLearningComponent,
    ImplantAppTestComponent,
    ImplantsEditComponent,
    AddImageImplantComponent,
    ImageViewComponent,
    ImplantVerificationComponent,
    ImplantVerificationViewComponent
  ],
  providers: [ AdminGuard ],
})

export class AdminLayoutModule {}
