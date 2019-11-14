import { Component, OnInit } from '@angular/core'
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
