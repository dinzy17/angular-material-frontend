import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { APIService } from 'app/api.service'
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';

@Component({
  selector: 'app-implants-details',
  templateUrl: './implants-details.component.html',
  styleUrls: ['./implants-details.component.scss']
})
export class ImplantsDetailsComponent implements OnInit {
  id: any ="";
  implantData: any ={};
  dialogRef:any ="";
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api:APIService, private dialog: MatDialog ) {
   }

  ngOnInit() {
  this.loader()
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id
      this.getDetail()
    })
  }

  getDetail(){
    this.api.apiRequest('post', 'implant/implantView', { id: this.id }).subscribe(result => {
      if(result.status == "success") {
          this.implantData = result.data.details
          //  this.implantData.objectLocation.height = ( 800 / this.implantData.objectLocation.height )
          //  this.implantData.objectLocation.left = ( 800 / this.implantData.objectLocation.left )
          //  this.implantData.objectLocation.top = ( 800 / this.implantData.objectLocation.top )
          //  this.implantData.objectLocation.width = (800 / this.implantData.objectLocation.width )
          console.log('test',this.implantData )
      } else {
        //this.snack.open(result.data.message, 'OK', { duration: 5000 });
      }
      this.loaderHide()
    }, (err) => {
      this.loaderHide()
      console.error(err)
    })
  }

  cancel(){
    this.router.navigate(['/', 'admin', 'implant-list'])
  }

  // for loder
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
