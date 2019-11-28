import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounce } from 'lodash'
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
  filteredOptions: Observable<Manufature[]>;
  filteredNames: Observable<Name[]>;
  names: Name[] = [];
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
    this.filteredOptions = this.form.controls['implantManufacture'].valueChanges
      .pipe(
        startWith(''),
        map(implantManufacture => implantManufacture ? this._filter(implantManufacture) : this.options.slice())
      );

      this.filteredNames = this.form.controls['label'].valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this._filterName(name) : this.names.slice())
      );
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
    this.api.apiRequest('post', 'implant/getManufacture', {}).subscribe(result => { //manufactureName:manufactureSearch
      if (result.status == "success") {
        this.options = result.data.implantList;
      }
    }) 
  }

  getImplantName(implantManufacture: String){
    this.api.apiRequest('post', 'implant/getImplantName', { implantManufacture:implantManufacture }).subscribe(result => {
      if (result.status == "success") {
        this.names = result.data.implantList;
      }
    }) 
  }

  filterManufacture(){
    let manufactureSearch = this.searchByString.trim();
    if (manufactureSearch.length > 1) {
      this.getManufacture();
   } else {
    this.options = [];
   }
  }

  filterName(){
    if(this.searchByString){
      let nameSearch = this.searchName.trim();
      if (nameSearch.length > 1) {
        this.getImplantName(this.searchByString.trim())
      } else {
        this.names = [];
      }
    } else {
      this.names = [];
    }
  }

  getDetail() {
    let manufacture = this.form.controls['implantManufacture'].value
    let name = this.form.controls['label'].value
    this.api.apiRequest('post', 'implant/getImplantDetail', { implantManufacture: manufacture , objectName: name }).subscribe(result => {
      if (result.status == "success") {
        this.form.get('surgeryLocation').setValue(result.data.surgeryLocation);
        this.form.get('removalProcess').setValue(result.data.removalProcess);
      }
    })
  }
 
  private _filter(implantManufacture: string): Manufature[] {
    const filterValue = implantManufacture.toLowerCase();

    return this.options.filter(option => option.implantManufacture.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterName(value: string): Name[] {
    const filterValue = value.toLowerCase();

    return this.names.filter(name => name.objectName.toLowerCase().indexOf(filterValue) === 0);
  }

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
