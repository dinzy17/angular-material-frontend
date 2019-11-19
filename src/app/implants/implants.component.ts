import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { APIService } from 'app/api.service'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-implants',
  templateUrl: './implants.component.html',
  styleUrls: ['./implants.component.scss']
})
export class ImplantsComponent implements OnInit {

  userId: string = localStorage.getItem("userId") || ""
  imageChangedEvent: any = ''
  croppedImage: any = ''
  form: FormGroup
  uploadedFile: File
  imageWidth: any = 0
  imageHeight: any = 0
  labelWidth: any = 0
  labelHeight: any = 0
  labelOffsetX: any = 0
  labelOffsetY: any = 0

  constructor(private api: APIService, private snack: MatSnackBar) { }

  ngOnInit() {

    this.form = new FormGroup({
      label: new FormControl('', [ Validators.required ]),
    })
  }

  //function to get file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent)
    let img = document.getElementById('implantImage') as HTMLInputElement
    this.uploadedFile = img.files[0]
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
      console.log("imageWidth => ", this.imageWidth)
      console.log("imageHeight => ", this.imageHeight)
      console.log("labelWidth => ", this.labelWidth)
      console.log("labelHeight => ", this.labelHeight)
      console.log("labelOffsetX => ", this.labelOffsetX)
      console.log("labelOffsetY => ", this.labelOffsetY)
      console.log(event)
  }

  //function to save details
  saveImplant(implantData) {
    const formData = {
      userId: this.userId,
      labelName: implantData.label,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight,
      labelWidth: this.labelWidth,
      labelHeight: this.labelHeight,
      labelOffsetX: this.labelOffsetX,
      labelOffsetY: this.labelOffsetY
    }
    const fd = new FormData()
    fd.append('implantPicture', this.uploadedFile, this.uploadedFile.name)
    for (var key in formData) {
      console.log(key, formData[key])
      fd.append(key, formData[key])
    }
    new Response(fd).text().then(console.log)

    this.api.apiRequest('post', 'implant/test', fd).subscribe(result => {
      if(result.status == "success"){
        this.snack.open("Successfully!", 'OK', { duration: 5000 })
      } else {
        this.snack.open(result.data, 'OK', { duration: 5000 })
      }
    }, (err) => {
      console.error(err)
    })
  }


}
