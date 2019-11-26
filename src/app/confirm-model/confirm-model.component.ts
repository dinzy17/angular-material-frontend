import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { APIService } from "app/api.service";

@Component({
  selector: 'app-confirm-model',
  templateUrl: './confirm-model.component.html',
  styleUrls: ['./confirm-model.component.scss']
})
export class ConfirmModelComponent implements OnInit {
  message = "Are you sure you want to change status?"
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private api: APIService, private dialog: MatDialog, private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ConfirmModelComponent>,) {
    if(data){
      this.message = data.message
    } 
   }


  ngOnInit() {
  }

  reject(){
    this.closeModal()
  }

  accept(){
    this.data.active = !this.data.active
    this.api.apiRequest("post", "user/updateUserStatus", { userId: this.data._id, active: this.data.active }).subscribe(
      result => {
        this.dialogRef.close({changes:"yes"});
      },
      err => {
        console.error(err);
      }
    );
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
