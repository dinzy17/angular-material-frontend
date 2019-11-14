import { Component, OnInit, ElementRef } from '@angular/core'
import { ROUTES } from '../sidebar/sidebar.component'
import { Router } from '@angular/router'

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.css']
})
export class AuthHeaderComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit() {
    }

}
