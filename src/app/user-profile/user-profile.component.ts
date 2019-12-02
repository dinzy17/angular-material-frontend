import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('form', {static: false}) form;
  @ViewChild('emialForm', {static: false}) emialForm

  public changeEmailForm: FormGroup;
  public changePasswordForm: FormGroup;
  passwordRegex: any = /^.{6,}$/
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar) { }
  userId = "";
  email = "";
  ngOnInit() {
      this.email = localStorage.getItem('username');  
      // for change email
    this.changeEmailForm = this.fb.group ({
      email: [null, Validators.compose([ Validators.required, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i), this.emailCompare])],
      currentEmail: [this.email],
    })
    this.createChangePasswordForm()
    this.userId = localStorage.getItem('userId')
  }

  //function to crreate change password form
  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group ({
      password: [null, Validators.compose([ Validators.required, Validators.pattern(this.passwordRegex), this.whitespace ])],
      confirmPassword: [null, Validators.compose([ Validators.required ])],
      oldPassword: [null, Validators.compose([ Validators.required])] 
    }, {
      validator: this.comparePassword
    })
  }

  // custome validate.
    emailCompare(control: FormControl) { 
    let email = control.value
    if (email === localStorage.getItem('username')) { 
        return {
          emailCompare: true
        }
    }
    return null
  }

  // custome validate.
  whitespace(control: FormControl) {
    let password =  control.value
    var inValid = /\s/;
    var k = inValid.test(password);
    if(k){
      return {
        whitespace: true
      }  
    }
    return null
  }

  // compare password validate
  comparePassword(control: AbstractControl){
    let password = control.get('password').value
    let confirmPassword = control.get('confirmPassword').value
    if (password !== confirmPassword) {
        control.get('confirmPassword').setErrors( {passwordCompare: true} )
    }else{
      return null;
    }
  }


  save(userData:any) {
    userData.userId = this.userId;
    this.api.apiRequest('post', 'user/adminProfileUpdate', userData).subscribe(result => {
      if(result.status == "success"){
        if(result.data.email){
          localStorage.setItem('username', result.data.email)
          this.changeEmailForm.setValue({
            email: "",
            currentEmail: result.data.email,
          })
          //this.email = result.data.email;
        } else {
          this.form.resetForm();
        }
        if (userData.email) {
          this.emialForm.resetForm();
          this.changeEmailForm.get('currentEmail').setValue(result.data.email);
        } else {
          this.form.resetForm();
        }
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
      } else {
        if (userData.email) {
          this.emialForm.resetForm();
        } else {
          this.form.resetForm();
        }
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }
}
