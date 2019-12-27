import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import { APIService } from 'app/api.service'

@Component({
  selector: 'app-support-edit',
  templateUrl: './support-edit.component.html',
  styleUrls: ['./support-edit.component.scss']
})
export class SupportEditComponent implements OnInit {
  @ViewChild('emialForm', {static: false}) emialForm
  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar) {
    if(data){
      
    } 
   }

  ngOnInit() {
    this.form = this.fb.group ({
      replay: [this.data.replay, Validators.compose([ Validators.required ])],
    })
    
    let replace = this.data.replay.replace(/<br>/gi, '\n');
    this.form.get('replay').setValue(replace); 
  }
  
  closeModal(): void {
    this.dialog.closeAll();
  }

  send(supportData:any) {
    supportData.id = this.data._id;
    supportData.email = this.data.senderEmail;
    this.api.apiRequest('post', 'support/sendReplay', supportData).subscribe(result => {
      if(result.status == "success"){
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
        this.dialog.closeAll();
      } else {
        this.snack.open(result.data.message, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }

}
