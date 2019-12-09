import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginform', {static: false}) loginform;
  public signInForm: FormGroup;
  showSpinner = false
  dialogRef:any ="";
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar, private dialog: MatDialog) { }

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
    this.loader();
    this.api.login(userData).subscribe(result => {
      if (result.status == "success") {
        this.loaderHide()     
        this.router.navigate(['/', 'admin', 'dashboard'])    
      } else {
        this.loaderHide()     
        this.loginform.resetForm()
        this.snack.open("Please check your login credentials and try again. ", 'OK', { duration: 5000 })
      }
    }, (err) => {
      this.loaderHide()     
      this.loginform.resetForm()
      console.error(err)
    })
  }

  loader(){

    this.dialogRef = this.dialog.open(SidLoderComponentComponent,{
       panelClass: 'lock--panel',
       backdropClass: 'lock--backdrop',
       disableClose: true
     });    
   }
 
   loaderHide(){
     this.dialogRef.close();
   }

}
