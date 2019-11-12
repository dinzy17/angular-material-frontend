import { Component, OnInit } from '@angular/core'
import { NavbarComponent } from '../../components/navbar/navbar.component'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
