import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-admin-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  forgot() {
    this.router.navigate(['/', 'login'])
  }

}
