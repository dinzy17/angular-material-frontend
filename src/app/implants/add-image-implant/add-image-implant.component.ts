import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { APIService } from '../../api.service';
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';

@Component({
  selector: 'app-add-image-implant',
  templateUrl: './add-image-implant.component.html',
  styleUrls: ['./add-image-implant.component.scss']
})
export class AddImageImplantComponent implements OnInit {
  imageChangedEvent: any = ''
  croppedImage: any = ''
  uploadedFile: File
  imageWidth: any = 0
  imageHeight: any = 0
  labelWidth: any = 0
  labelHeight: any = 0
  labelOffsetX: any = 0
  labelOffsetY: any = 0
  disabledSave: boolean = false
  dialogRefLoder:any ="";
  imageValidExtensions: string[] = ['jpg', 'png', 'jpeg']
  imageError: boolean = false
  imageValidError: boolean = false
  returnData: any = {}
  realImage: any = ""
  constructor( private api: APIService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddImageImplantComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    console.log(this.data)
  }

  //function to get file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageValidError = false
    let img = document.getElementById('implantImage') as HTMLInputElement
    const filename = img.files[0].name
      const fileExt = filename.split(".").splice(-1)[0].toLowerCase()
        if(this.imageValidExtensions.indexOf(fileExt) == -1) {
          this.resetValues()
          this.imageValidError = true
        } else {
          this.uploadedFile = img.files[0]
          this.disabledSave = false
          this.imageError = false;
        }
  }

  //function to assign cropper
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.imageWidth = event.imagePosition.x2
      this.imageHeight = event.imagePosition.y2
      let widthFactor = this.imageWidth / event.cropperPosition.x2
      let heightFactor = this.imageHeight / event.cropperPosition.y2
      this.labelWidth = (event.cropperPosition.x2 - event.cropperPosition.x1) * widthFactor
      this.labelHeight = (event.cropperPosition.y2 - event.cropperPosition.y1) * heightFactor
      this.labelOffsetX = event.cropperPosition.x1 * widthFactor
      this.labelOffsetY = event.cropperPosition.y1 * heightFactor
  }

  resetValues() {
    this.uploadedFile = null
    this.croppedImage = ""
    this.imageChangedEvent = null
    this.imageWidth = 0
    this.imageHeight = 0
    this.labelWidth = 0
    this.labelHeight = 0
    this.labelOffsetX = 0
    this.labelOffsetY = 0
    let img = document.getElementById('implantImage') as HTMLInputElement
  }

  saveDetail(){
    if(this.uploadedFile && this.uploadedFile.name !="") {
      this.returnData.imageWidth = this.imageWidth
      this.returnData.imageHeight = this.imageHeight,
      this.returnData.labelWidth = this.labelWidth,
      this.returnData.labelHeight =  this.labelHeight,
      this.returnData.labelOffsetX =  this.labelOffsetX,
      this.returnData.labelOffsetY =  this.labelOffsetY,
      this.returnData.uploadedFile = this.uploadedFile
      this.returnData.image = this.croppedImage
      //this.returnData.uploadedFile = this.realImage
      this.dialogRef.close({ 'imageData': this.returnData });  
      } else {
      this.imageError = true;
    } 
  }

  closeBtn(){
    this.dialogRef.close();  
  }
}
