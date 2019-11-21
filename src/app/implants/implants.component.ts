import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { debounce } from 'lodash'
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from 'app/api.service'

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
  disabledSave: boolean = false

  constructor(private api: APIService, private snack: MatSnackBar, private router:Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      label: new FormControl('', [ Validators.required ]),
    })
  }

  //function to get file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    let img = document.getElementById('implantImage') as HTMLInputElement
    this.uploadedFile = img.files[0]
    this.disabledSave = false
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

  //function to save details
  saveImplant(implantData) {
    this.disabledSave = true
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
      fd.append(key, formData[key])
    }

    this.api.apiRequest('post', 'implant/addImageToCollection', fd).subscribe(result => {
      if(result.status == "success"){
        this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
        // setTimeout(() => {
        //   this.router.navigate(["/", "admin", "dashboard"])
        // }, 3000)
      } else {
        this.snack.open(result.data, 'OK', { duration: 3000 })
      }
      this.resetValues()
    }, (err) => {
      console.error(err)
      this.disabledSave = false
    })
  }

  resetValues() {
    this.uploadedFile = null
    this.imageWidth = 0
    this.imageHeight = 0
    this.labelWidth = 0
    this.labelHeight = 0
    this.labelOffsetX = 0
    this.labelOffsetY = 0
    let img = document.getElementById('implantImage') as HTMLInputElement
    img.value = ""
    // this.croppedImage = null
  }

}
