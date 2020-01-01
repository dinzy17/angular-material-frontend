import { Component, OnInit, ElementRef } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-main-site-header',
  templateUrl: './main-site-header.component.html',
  styleUrls: ['./main-site-header.component.css']
})
export class MainSiteHeaderComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit() {
    }

}
