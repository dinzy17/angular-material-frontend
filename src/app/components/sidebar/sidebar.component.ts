import { Component, OnInit } from '@angular/core'

declare interface RouteInfo {
    path: string
    title: string
    icon: string
    class: string
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/admin/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/admin/notifications', title: 'Notifications',  icon:'notifications', class: '' },
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[]

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem)
  }

  //function to check if it is mobile menu
  isMobileMenu() {
      if (window.screen.width > 991) {
          return false
      }
      return true
  }
}
