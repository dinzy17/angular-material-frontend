import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-surgical-implants',
  templateUrl: './surgical-implants.component.html',
  styleUrls: ['./surgical-implants.component.scss']
})
export class SurgicalImplantsComponent implements OnInit {

  fileData: File = null;
  previewUrl:any = null;


  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor() { }
  
  ngOnInit() {
  }

  public message: string;
 
  preview(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

}
