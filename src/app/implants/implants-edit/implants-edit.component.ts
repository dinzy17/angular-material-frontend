import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, FormBuilder, FormArray, Validators,  ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounce, cloneDeep } from 'lodash'
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { APIService } from 'app/api.service'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SidLoderComponentComponent } from 'app/sid-loder-component/sid-loder-component.component';
import { AddImageImplantComponent } from 'app/implants/add-image-implant/add-image-implant.component';
import { ImageViewComponent } from 'app/implants/image-view/image-view.component';
export interface Manufature {
  implantManufacture: string;
}

export interface Name {
  imgName: string;
  objectName: string;
}

@Component({
  selector: 'app-implants-edit',
  templateUrl: './implants-edit.component.html',
  styleUrls: ['./implants-edit.component.scss']
})
export class ImplantsEditComponent implements OnInit {
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  @ViewChild('implantForm', {static: false}) implantForm
  id: any =""
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
  dialogRefView:any = ""
  removaProcessError: any = [];
  validationError: boolean = false;
  implantDetail: any ={};
  changeImage: boolean = false
  displayHighlite: boolean = false
  data: any = {}
  viewImageData: any = {}
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private api: APIService, private snack: MatSnackBar, private router:Router, private dialog: MatDialog) { }

  ngOnInit() {
    //this.loader()
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id
      this.getDetail()
    })
    /* Initiate the form structure */
    this.form = this.fb.group({
      label: ["", [ Validators.required, Validators.maxLength(150)]],
      implantManufacture: ["", [ Validators.required, Validators.maxLength(150)]],
      removalSection: this.fb.array([
        this.fb.group({
          removalProcess: ["", Validators.required],
          surgeryDate: ["", [Validators.required]],
          surgeryLocation: ["", [Validators.required]],
        })
     ])  
    })
    // call get manufacture for auto complete.
    this.getManufacture()
  }

  getDetail(){
    this.loader()
    this.api.apiRequest('post', 'implant/implantView', { id: this.id }).subscribe(result => {
      if(result.status == "success") {
        this.implantDetail = result.data.details
        this.form.controls.label.setValue(this.implantDetail.objectName)
        this.form.controls.implantManufacture.setValue(this.implantDetail.implantManufacture)
        for ( let i = 0; i < this.implantDetail.removImplant.length; i++ ) {
          if (i > 0){
            this.addRow();
          }
          this.form.controls.removalSection['controls'][i]['controls']['removalProcess'].setValue(this.implantDetail.removImplant[i].removalProcess);
          this.form.controls.removalSection['controls'][i]['controls']['surgeryDate'].setValue(this.implantDetail.removImplant[i].surgeryDate);    
          this.form.controls.removalSection['controls'][i]['controls']['surgeryLocation'].setValue(this.implantDetail.removImplant[i].surgeryLocation);    
        }
        this.viewImageData = this.implantDetail.imageData
        this.loaderHide()
      } else {
        this.loaderHide()
      }
    }, (err) => {
      this.loaderHide()
      console.error(err)
    })
  }

  /**
   * Create form Removal Process.
   */
  private getRemovalProcess() {
    return this.fb.group({
      removalProcess: ['', ],
      surgeryDate: [""],
      surgeryLocation: [''],
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
    if( this.implantDetail.removImplant[i] !== undefined ) {
      delete this.implantDetail.removImplant[i];
    }
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
        if( this.implantDetail.removImplant[index] !== undefined ) {
          implantData.removalSection[index].id = this.implantDetail.removImplant[index].id
          implantData.removalSection[index].createdDate = this.implantDetail.removImplant[index].createdDate
          implantData.removalSection[index].isApproved = this.implantDetail.removImplant[index].isApproved
          implantData.removalSection[index].userId = this.implantDetail.removImplant[index].userId
        }
      }
    }
    console.log('implantData.removalSection', implantData.removalSection)
    if (!this.validationError) {
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
      if ((this.uploadedFile !== undefined)) {  //&& this.uploadedFile.name != ""
        fd.append('implantPicture', this.uploadedFile, this.uploadedFile.name)
      }
      for (var key in formData) {
        fd.append(key, formData[key])
      }
        fd.append('removeImplant', JSON.stringify(implantData.removalSection));
        fd.append('addBy', "admin");
        fd.append('implantId', this.id);
        
       // this.api.apiRequest('post', 'implant/editImageToCollection', fd).subscribe(result => {
        this.api.apiRequest('post', 'implant/editImplantApi', fd).subscribe(result => {
        this.loaderHide();
        if(result.status == "success"){
          this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
          this.uploadedFile = null
          this.getDetail()
          this.disabledSave = false
        } else {
          this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
        }
        this.resetValues()
      }, (err) => {
        this.loaderHide();
        console.error(err)
        this.disabledSave = false
      })
    }
  }

  resetValues() {
    this.uploadedFile = undefined
    this.croppedImage = ""
    this.imageWidth = 0
    this.imageHeight = 0
    this.labelWidth = 0
    this.labelHeight = 0
    this.labelOffsetX = 0
    this.labelOffsetY = 0
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

   imageChange(){
    this.changeImage = true
    const dialogRef = this.dialog.open(AddImageImplantComponent,{
      width: "65%",
      height:"80%",
      disableClose: false,
      data:this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.uploadedFile = result.imageData.uploadedFile 
        this.imageWidth = result.imageData.imageWidth
        this.imageHeight = result.imageData.imageHeight
        this.labelWidth = result.imageData.labelWidth
        this.labelHeight = result.imageData.labelHeight
        this.labelOffsetX = result.imageData.labelOffsetX
        this.labelOffsetY = result.imageData.labelOffsetY
        this.croppedImage = result.imageData.image
      } else {
        this.imageError = true;
      } 
    })
   }  

   cancelImageChange(){
    this.changeImage = false
    this.imageError = false
    this.imageValidError = false
   }

   cancel(){
    this.router.navigate(['/', 'admin', 'implant-list'])
  }
  deleteImage(implantImageData, implantId){
    implantImageData._id = implantId
    this.loader();
    this.api.apiRequest('post', 'implant/deleteImage',implantImageData).subscribe(result => {
      this.loaderHide();
      if(result.status == "success"){
        this.loaderHide();
        this.getDetail()
        this.snack.open("Successfully delete image !", 'OK', { duration: 3000 })
      } else {
      //  this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
      }
     // this.resetValues()
    }, (err) => {
      this.loaderHide();
      console.error(err)
      this.disabledSave = false
    })
  }

  resetImage() {
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
  }

  imageView(i){
    const dialogRefView = this.dialog.open(ImageViewComponent,{
      width: "65%",
      height:"80%",
      disableClose: false,
      data:this.viewImageData[i]
    });
  }
}
