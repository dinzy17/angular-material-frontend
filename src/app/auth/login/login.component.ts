import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public signInForm: FormGroup;
  showSpinner = false
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar) { }

  ngOnInit() {
    if(this.api.isLoggedIn()){
      this.router.navigate(['/', 'admin', 'dashboard'])
    }
    this.signInForm = this.fb.group ( {
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i)])] ,
      password: [null , Validators.compose([Validators.required])]
  });
  localStorage.clear()
  sessionStorage.clear()
  }

  login( userData:any ) {
   // this.showSpinner = true;
    // api request for login.

    this.api.login(userData).subscribe(result => {
      if (result.status == "success") {
        this.router.navigate(['/', 'admin', 'dashboard'])    
      } else {
        this.snack.open("Please check your credentials and try again. ", 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }

}
