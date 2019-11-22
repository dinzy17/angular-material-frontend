import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public resetform: FormGroup;
  userId: string = ""
  emailId: string = ""
  passwordRegex: any = /^.{6,}$/
  constructor(private api:APIService, private fb: FormBuilder, private snack: MatSnackBar, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if(this.api.isLoggedIn()){
      this.router.navigate(['/', 'admin', 'dashboard'])
    }
    this.resetform = this.fb.group( {
      email:[''],
      password: [null, Validators.compose([ Validators.required, Validators.pattern(this.passwordRegex) ])],
      confirmPassword: [null, Validators.compose([ Validators.required ])],
    }, {
      validator: this.comparePassword // your validation method
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params.id
    })
    this.getEmail();
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

  getEmail(){
    this.api.apiRequest('post', 'auth/getUserEmail', { userId: this.userId }).subscribe(result => {
      if(result.status == "success") {
        this.emailId = result.data.email;
      } else {
        //this.snack.open(result.data.message, 'OK', { duration: 5000 });
      }
    }, (err) => {
      console.error(err)
    })
  }

  reset(userData:any) {
    userData.userId = this.userId;
    this.api.apiRequest('post', 'auth/adminResetPassword', userData).subscribe(result => {
      if(result.status == "success"){
        this.snack.open("Your password sucessfully reste. Now login with this password!", 'OK', { duration: 5000 })
        if(result.data.userType == "adminUser"){
          this.router.navigate (['', 'login']);
        }
      } else {
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }
}
