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
  displayHighlite: boolean = false
  height: any = []
  width: any = []
  left: any = []
  top: any = []
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api:APIService, private dialog: MatDialog ) {
   }

  ngOnInit() {
 // this.loader()
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id
      this.getDetail()
    })
  }

  getDetail(){
    this.api.apiRequest('post', 'implant/implantView', { id: this.id }).subscribe(result => {
      if(result.status == "success") {
          this.implantData = result.data.details
          console.log(this.implantData.imageData.length);
          for (let i = 0; i < this.implantData.imageData.length; i ++ ){
            
            let img = new Image();
           img.onload = () => {
            var height = img.height;
            var width = img.width;
            // code here to use the dimensions
            let dispyaImgage = document.getElementById('displayImage'+i) as HTMLInputElement
            var currWidth = dispyaImgage.clientWidth;
            var currHeight = dispyaImgage.clientHeight;

            this.height[i] = ( currHeight * this.implantData.imageData[i].objectLocation.height ) / height
            this.width[i] = (currWidth * this.implantData.imageData[i].objectLocation.width ) / width
            this.top[i] = ( currHeight * this.implantData.imageData[i].objectLocation.top ) / height
            this.left[i] = ( currWidth * this.implantData.imageData[i].objectLocation.left ) / width
            console.log(this.height[i])
            console.log(this.width[i])
            console.log(this.top[i])
            console.log(this.left[i])

            // this.implantData.objectLocation.height = ( currHeight * this.implantData.objectLocation.height ) / height
            // this.implantData.objectLocation.top = ( currHeight * this.implantData.objectLocation.top ) / height
            // this.implantData.objectLocation.left = ( currWidth * this.implantData.objectLocation.left ) / width
            // this.implantData.objectLocation.width = (currWidth * this.implantData.objectLocation.width ) / width
           // this.displayHighlite = true
           }
          img.src = this.implantData.imageData[i].imageName; 
          }
         // this.loaderHide();
          this.displayHighlite = true
      } else {
        this.loaderHide()
        //this.snack.open(result.data.message, 'OK', { duration: 5000 });
      }
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
