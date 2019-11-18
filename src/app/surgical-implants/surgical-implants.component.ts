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

  //function to get file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  //function to assign cropper
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }


}
