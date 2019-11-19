import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  public forgotForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar) { }

  ngOnInit() {
    if(this.api.isLoggedIn()){
      this.router.navigate(['/', 'admin', 'dashboard'])
    }
    // inisiate from
    this.forgotForm = this.fb.group ( {
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i)])]
    });
  }

  forgot(userData:any) {
    console.log('userData',userData);
    this.api.apiRequest('post', "auth/adminForgotPassword", userData).subscribe(result => {
      if(result.status == "success"){
        this.router.navigate(['/', 'login'])    
        this.snack.open(result.data, 'OK', { duration: 5000 })
      } else {
        this.snack.open(result.data, 'OK', { duration: 5000 })
      }
    }, (err) => {
      this.snack.open("some things want to wrong. Try agin!", 'OK', { duration: 5000 })
    })
  }
}
