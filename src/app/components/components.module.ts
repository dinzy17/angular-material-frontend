import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { MainSiteHeaderComponent } from './main-site-header/main-site-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AuthHeaderComponent,
    MainSiteHeaderComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AuthHeaderComponent,
    MainSiteHeaderComponent
  ]
})
export class ComponentsModule { }
