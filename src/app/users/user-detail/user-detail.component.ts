import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    if(data){
      
    } 
   }

  ngOnInit() {
    console.log(this.data)
  }
  
  closeModal(): void {
    this.dialog.closeAll();
  }

}
