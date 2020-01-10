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
  selector: 'app-implant-verification-view',
  templateUrl: './implant-verification-view.component.html',
  styleUrls: ['./implant-verification-view.component.scss']
})
export class ImplantVerificationViewComponent implements OnInit {
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
          removalProcess: ["", Validators.required]
          // surgeryDate: ["", [Validators.required]],
          // surgeryLocation: ["", [Validators.required]],
        })
     ])  
    })
  }

  getDetail(){
    this.loader()
    this.api.apiRequest('post', 'implant/implantView', { id: this.id }).subscribe(result => {
      if(result.status == "success") {
        this.implantDetail = result.data.details
        this.implantDetail.userFullName = result.data.userFullName
        let users = result.data.users
        this.form.controls.label.setValue(this.implantDetail.objectName)
        this.form.controls.implantManufacture.setValue(this.implantDetail.implantManufacture)
        for ( let i = 0; i < this.implantDetail.removImplant.length; i++ ) {
          if (i > 0){
            this.addRow();
          }
          this.form.controls.removalSection['controls'][i]['controls']['removalProcess'].setValue(this.implantDetail.removImplant[i].removalProcess);
          // this.form.controls.removalSection['controls'][i]['controls']['surgeryDate'].setValue(this.implantDetail.removImplant[i].surgeryDate);    
          // this.form.controls.removalSection['controls'][i]['controls']['surgeryLocation'].setValue(this.implantDetail.removImplant[i].surgeryLocation);    
        }
        this.viewImageData = this.implantDetail.imageData
        this.implantDetail.imageData.map((o)=> {
          let user = users.find(u => u._id == o.userId)
          o.userFullName = user.fullName
        })
        this.implantDetail.removImplant.map((o)=> {
          let user = users.find(u => u._id == o.userId)
          o.userFullName = user.fullName
        })
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


  /*
  add removal process
  */ 
  addRow() {
    const control = <FormArray>this.form.controls['removalSection'];
    control.push(this.getRemovalProcess());
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

  cancel(){
    this.router.navigate(['/', 'admin', 'implant-list'])
  }

  imageView(i){
    this.viewImageData[i].objectName = this.implantDetail.objectName
    const dialogRefView = this.dialog.open(ImageViewComponent,{
      width: "620px",
      panelClass: "nopad--modal",
      disableClose: true,
      data:this.viewImageData[i]
    });
  }

  approve(){
    this.loader()
    this.api.apiRequest("post", "verificationImplant/approveImplant", { id: this.id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully approve implant and added for training!", 'OK', { duration: 3000 })
          this.loaderHide()
          //this.getDetail()
          this.ngOnInit();
        }  
      },
      err => {
        console.error(err);
      }
    );
  }

  rejecte(){
    this.loader()
    this.api.apiRequest("post", "verificationImplant/rejectImplant", { id: this.id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully reject implant", 'OK', { duration: 3000 })
          this.loaderHide()
          //this.getDetail()
          this.ngOnInit();
        }  
      },
      err => {
        console.error(err);
      }
    );
  }

  partialApproveRemovalProcess(id) {
    this.loader()
    this.api.apiRequest("post", "verificationImplant/partialApproveRemovalProcess", { implantId: this.id, id:id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully approve removal process", 'OK', { duration: 3000 })
          this.loaderHide()
          //this.getDetail()
          this.ngOnInit();
        }  
      },
      err => {
        console.error(err);
      }
    );
  }

  partialRejectRemovalProcess(id) {
    this.loader()
    this.api.apiRequest("post", "verificationImplant/partialRejectRemovalProcess", { implantId: this.id, id:id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully reject removal process", 'OK', { duration: 3000 })
          this.loaderHide()
          //this.getDetail()
          this.ngOnInit();
        }  
      },
      err => {
        console.error(err);
      }
    );
  }

  partialApproveImage(id) {
    this.loader()
    this.api.apiRequest("post", "verificationImplant/partialApproveImage", { implantId: this.id, id:id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully approve image and add for training", 'OK', { duration: 3000 })
          //this.getDetail()
          this.loaderHide()
          this.ngOnInit();
        }  
      },
      err => {
        console.error(err);
      }
    );
  }

  partialRejectImage(id) {
    this.loader()
    this.api.apiRequest("post", "verificationImplant/partialRejectImage", { implantId: this.id, id:id }).subscribe(
      result => {
        if(result.status == "success"){
          this.snack.open("Successfully reject image.", 'OK', { duration: 3000 })
          this.loaderHide()
          this.ngOnInit();
          
        }  
      },
      err => {
        console.error(err);
      }
    );
  }
}
