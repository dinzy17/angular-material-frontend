import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';
import { CustomValidators } from 'ng2-validation';

const password = new FormControl('', Validators.compose([ Validators.required ]));
const confirmPassword = new FormControl('', Validators.compose([ Validators.required, CustomValidators.equalTo(password) ]));
const oldPassword = new FormControl('', Validators.compose([ Validators.required ]));
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public changeEmailForm: FormGroup;
  public changePasswordForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar) { }
  userId = "";
  email = "";
  ngOnInit() {
      this.email = localStorage.getItem('username');  
      // for change email
      this.changeEmailForm = this.fb.group ({
      email: [this.email, Validators.compose([ Validators.required, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i) ])],
      currentEmail: [this.email],
      });
      
      // for change password.
      this.changePasswordForm = this.fb.group ({
        password: password,
        confirmPassword: confirmPassword,
        oldPassword: oldPassword 
      });

    this.userId = localStorage.getItem('userId');
  }

  save(userData:any) {
    userData.userId = this.userId;
    this.api.apiRequest('post', 'user/adminProfileUpdate', userData).subscribe(result => {
      if(result.status == "success"){
        if(result.data.email){
          localStorage.setItem('username', result.data.email)
        }
        this.snack.open("profile update successfully!", 'OK', { duration: 5000 })
      } else {
        this.snack.open(result.data, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }
}
