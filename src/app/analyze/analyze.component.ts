import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { debounce } from 'lodash'
import * as $ from 'jquery'
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from 'app/api.service'

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent implements OnInit {

  userId: string = localStorage.getItem("userId") || ""
  form: FormGroup
  uploadedFile: File
  disabledSave: boolean = false
  imageName: string = ""
  objects: any[] = []
  img_preview: boolean = false

  constructor(private api: APIService, private snack: MatSnackBar, private router:Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      image: new FormControl('', [ Validators.required ]),
    })
  }
  
  fileChangeEvent(e) {
    this.objects = []
    let img = document.getElementById('implantImage') as HTMLInputElement
    this.uploadedFile = img.files[0]
    this.imageName = this.uploadedFile.name
    this.disabledSave = false
    var reader = new FileReader()
    reader.onload = function(evt:any) {
      $('#preview_image').attr('src', evt.target.result)
    }
    this.img_preview = true
    reader.readAsDataURL(img.files[0])
  }


  //function to save details
  searchImplant() {
    this.disabledSave = true
    const fd = new FormData()
    fd.append('implantPicture', this.uploadedFile, this.uploadedFile.name)

    this.api.apiRequest('post', 'implant/analyzeImage', fd).subscribe(result => {
      if(result.status == "success"){
        if(result.data.images && result.data.images[0] && result.data.images[0].objects.collections && result.data.images[0].objects.collections.length > 0 ) {
          this.objects = result.data.images[0].objects.collections[0].objects
          this.snack.open("Image analysis complete!", 'OK', { duration: 3000 })
        } else {
          this.snack.open("Sorry! we could not match image with any of provided resources!", 'OK', { duration: 3000 })
        }
      } else {
        this.snack.open("Some error occured while searching for implant.", 'OK', { duration: 3000 })
      }
      this.resetValues()
    }, (err) => {
      console.error(err)
    })
  }

  resetValues() { 
    this.uploadedFile = null
    let img = document.getElementById('implantImage') as HTMLInputElement
    img.value = ""
  }

}
