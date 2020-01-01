import { Component, OnInit } from '@angular/core'
import { MainSiteHeaderComponent } from '../../components/main-site-header/main-site-header.component'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'

@Component({
  selector: 'app-main-site-layout',
  templateUrl: './main-site-layout.component.html',
  styleUrls: ['./main-site-layout.component.scss']
})

export class MainSiteLayoutComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
