import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormsModule, FormGroup, FormControl, Validators,  ValidationErrors } from '@angular/forms';
import { debounce } from 'lodash'
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from 'app/api.service'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
export interface Manufature {
  implantManufacture: string;
}

export interface State {
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
  filteredStates: Observable<State[]>;
  states: State[] = [];
  imageError: boolean = false;
  constructor(private api: APIService, private snack: MatSnackBar, private router:Router) { }

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

      this.filteredStates = this.form.controls['label'].valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
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
        this.states = result.data.implantList;
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
        this.states = [];
      }
    } else {
      this.states = [];
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

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.objectName.toLowerCase().indexOf(filterValue) === 0);
  }

}
