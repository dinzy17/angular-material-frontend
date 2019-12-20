import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, FormBuilder, FormArray, Validators,  ValidationErrors, AbstractControl } from '@angular/forms';
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
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  @ViewChild('implantForm', {static: false}) implantForm
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
  imageValidExtensions: string[] = ['jpg', 'png', 'jpeg']
  optionsAllData: Manufature[] = [];
  options: Manufature[] = [];
  filteredOptions: Manufature[];
  names: Name[] = [];
  filteredNames: Name[];
  imageError: boolean = false;
  imageValidError: boolean = false;
  dialogRef:any ="";
  removaProcessError: any = [];
  validationError: boolean = false;
  constructor(private fb: FormBuilder, private api: APIService, private snack: MatSnackBar, private router:Router, private dialog: MatDialog) { }

  ngOnInit() {
    /* Initiate the form structure */
    this.form = this.fb.group({
      label: ['', [ Validators.required, Validators.maxLength(150)]],
      implantManufacture: ['', [ Validators.required, Validators.maxLength(150)]],
      removalSection: this.fb.array([
        this.fb.group({
          removalProcess: ['', Validators.required],
          surgeryDate: ["", [Validators.required]],
          surgeryLocation: ['', [Validators.required]]
        })
     ])  
    })
    

    // call get manufacture for auto complete.
    this.getManufacture()
  }

  /**
   * Create form Removal Process.
   */
  private getRemovalProcess() {
    return this.fb.group({
      removalProcess: ['', ],
      surgeryDate: [""],
      surgeryLocation: ['']
    });
  }


  // compare password validate
  removaProcessValidation(control: AbstractControl){
    let removalProcess = control.get('removalProcess').value
    let surgeryDate = control.get('surgeryDate').value
    let surgeryLocation = control.get('surgeryLocation').value
    if ((removalProcess.trim() == "") && (surgeryDate.trim() == "") && (surgeryLocation.trim() == "")) {
        control.get('removalProcess').setErrors( { requiredProcess: true } )
        control.get('surgeryDate').setErrors( { requiredProcess: true } )
        control.get('surgeryLocation').setErrors( { requiredProcess: true } )
    } else {
      return null;
    }
  }

  /*
  add removal process
  */ 
  addRow() {
    const control = <FormArray>this.form.controls['removalSection'];
    control.push(this.getRemovalProcess());
  }

  delete(i) {
    const control = <FormArray>this.form.controls['removalSection'];
    control.removeAt(i);
  }


  //function to get file
  fileChangeEvent(event: any): void {
    console.log('event test', event);
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

  //function to save details
  saveImplant(implantData) {
    this.validationError = false
    for(let index in implantData.removalSection){
      if((implantData.removalSection[index].removalProcess =="") && (implantData.removalSection[index].surgeryDate == "") && (implantData.removalSection[index].surgeryLocation == "")){
        delete implantData.removalSection[index];  
      } else if ((implantData.removalSection[index].removalProcess =="") || (implantData.removalSection[index].surgeryDate == "") || (implantData.removalSection[index].surgeryLocation == "")) {
        this.removaProcessError[index] = true
        this.validationError = true
      } else {
        this.removaProcessError[index] = false
      }
    }
    
    if(this.uploadedFile && this.uploadedFile.name !="" && !this.validationError ) {
      this.loader();
      this.disabledSave = true
      const formData = {
        accessToken: localStorage.getItem('token'),
        userId: this.userId,
        labelName: implantData.label,
        implantManufacture: implantData.implantManufacture,
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
        fd.append('removeImplant', JSON.stringify(implantData.removalSection));

        this.api.apiRequest('post', 'implant/addImageToCollection', fd).subscribe(result => {
        this.loaderHide();
        if(result.status == "success"){
          this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
          this.implantForm.resetForm();
        } else {
          this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
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
    this.croppedImage = ""
    this.imageChangedEvent = null
    this.imageWidth = 0
    this.imageHeight = 0
    this.labelWidth = 0
    this.labelHeight = 0
    this.labelOffsetX = 0
    this.labelOffsetY = 0
    let img = document.getElementById('implantImage') as HTMLInputElement
    img.value = ""
    const control = <FormArray>this.form.controls['removalSection'];
    for(let i = 0; i <= control.length; i++ ){
      if(i > 0){
        this.delete(i);
      }
    }
  }

  getManufacture() {
    this.api.apiRequest('post', 'implant/getManufacture', {}).subscribe(result => {
      if (result.status == "success") {
        this.options = result.data.implantList;
        this.optionsAllData = result.data.implantList;
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
    } else {
      this.filteredOptions = []
    }
  }, 500)

  filterName = debounce(() => {
    if(this.searchByString){
      let nameSearch = this.searchName.trim().toLowerCase()
      let manufactureSearch = this.searchByString.trim()
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
