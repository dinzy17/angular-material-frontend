import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounce, cloneDeep } from 'lodash'
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from 'app/api.service'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';
export interface Manufature {
  implantManufacture: string;
}

export interface Name {
  imgName: string;
  objectName: string;
}



@Component({
  selector: 'app-implants',
  templateUrl: './implants.component.html',
  styleUrls: ['./implants.component.scss']
})
export class ImplantsComponent implements OnInit {
  myControl = new FormControl();
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
  searchByString:any;
  searchName: any;
  options: Manufature[] = [];
  filteredOptions: Manufature[];
  names: Name[] = [];
  filteredNames: Name[];
  imageError: boolean = false;
  dialogRef:any ="";
  constructor(private api: APIService, private snack: MatSnackBar, private router:Router, private dialog: MatDialog) { }

  ngOnInit() {

    this.form = new FormGroup({
      label: new FormControl('', [ Validators.required ]),
      implantManufacture: new FormControl('', [ Validators.required ]),
      surgeryDate: new FormControl('', [ Validators.required ]),
      surgeryLocation: new FormControl('', [ Validators.required ]),
      removalProcess: new FormControl('', [ Validators.required ])
    })
    this.getManufacture()
  }


  //function to get file
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    let img = document.getElementById('implantImage') as HTMLInputElement
    this.uploadedFile = img.files[0]
    this.disabledSave = false
    this.imageError = false;
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
    if(this.uploadedFile && this.uploadedFile.name !="") {
      this.loader();
      this.disabledSave = true
      const formData = {
        userId: this.userId,
        labelName: implantData.label,
        implantManufacture: implantData.implantManufacture,
        surgeryDate: implantData.surgeryDate,
        surgeryLocation: implantData.surgeryLocation,
        removalProcess: implantData.removalProcess,
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
        this.loaderHide();
        if(result.status == "success"){
          this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
           setTimeout(() => {
            location.reload();
           }, 3000)
        } else {
          this.snack.open(result.data, 'OK', { duration: 3000 })
        }
        this.resetValues()
      }, (err) => {
        this.loaderHide();
        console.error(err)
        this.disabledSave = false
      })
    } else {
      this.imageError = true;
    }
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

  getManufacture() {
    this.api.apiRequest('post', 'implant/getManufacture', {}).subscribe(result => {
      if (result.status == "success") {
        this.options = result.data.implantList;
      }
    })
  }

  //function to filter manufacturer
  filterManufacture = debounce(() => {
    let manufactureSearch = this.searchByString.trim().toLowerCase()
    if (manufactureSearch.length > 2) {
      let allOptions = cloneDeep(this.options)
      this.filteredOptions = allOptions.filter((o)=> {
        return o.implantManufacture.toLowerCase().indexOf(manufactureSearch) > -1
      })  
    }
  }, 500)

  filterName = debounce(() => {
    if(this.searchByString){
      let nameSearch = this.searchName.trim().toLowerCase()
      let manufactureSearch = this.searchByString.trim().toLowerCase()
      if (nameSearch.length > 2) {
          this.api.apiRequest('post', 'implant/getImplantName', { implantManufacture: manufactureSearch }).subscribe(result => {
          if (result.status == "success") {
            this.names = result.data.implantList
            let allNames = cloneDeep(this.names)
            this.filteredNames = allNames.filter(o => o.objectName.toLowerCase().indexOf(nameSearch) > -1 )
          }
        }) 
      } else {
        this.names = [];
      }
    } else {
      this.names = [];
    }
  }, 500)

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
