import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { APIService } from '../../api.service';
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
  height: any = ""
  width: any = ""
  left: any = ""
  top: any = ""
  displayHighlite: boolean = false
  constructor( private api: APIService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ImageViewComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    console.log('data', this.data);
    let img = new Image();
    img.onload = () => {
     var height = img.height;
     var width = img.width;
     console.log('height', height)
     console.log('width', width)
     // code here to use the dimensions
     let dispyaImgage = document.getElementById('displayImage') as HTMLInputElement
     var currWidth = dispyaImgage.clientWidth;
     var currHeight = dispyaImgage.clientHeight;
     this.height = ( currHeight * this.data.objectLocation.height ) / height
     this.width = (currWidth * this.data.objectLocation.width ) / width
     this.top = ( currHeight * this.data.objectLocation.top ) / height
     this.left = ( currWidth * this.data.objectLocation.left ) / width
     this.displayHighlite = true
    }
   img.src = this.data.imageName; 
  }

  closeModel(){
    this.dialogRef.close();
  }

}
