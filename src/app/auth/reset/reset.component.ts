import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';
import { CustomValidators } from 'ng2-validation';

const password = new FormControl('', [Validators.required]);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public resetform: FormGroup;
  userId: string = ""
  constructor(private api:APIService, private fb: FormBuilder, private snack: MatSnackBar, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if(this.api.isLoggedIn()){
      this.router.navigate(['/', 'admin', 'dashboard'])
    }
    this.resetform = this.fb.group( {
      password: password,
      confirmPassword: confirmPassword
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params.id
      console.log(this.userId)
    })
  }

  reset(userData:any) {
    userData.userId = this.userId;
    this.api.apiRequest('post', 'auth/adminResetPassword', userData).subscribe(result => {
      if(result.status == "success"){
        this.snack.open("Your password sucessfully reste. Now login with this password!", 'OK', { duration: 5000 })
        this.router.navigate (['', 'login']);
      } else {
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }
}
