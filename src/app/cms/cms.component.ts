import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { APIService } from 'app/api.service';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { debounce } from 'lodash'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})

export class CMSComponent implements OnInit {
  public Editor = ClassicEditor;  
  public cmsForm: FormGroup;
  pages: any[] = []
  editorData: any[] = []
  errorContent: any = []
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  validationError = false;
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar,) { }
  ngOnInit() {
    this.errorContent = [
      { "id":"1", "error": false },
      { "id":"2", "error": false },
      { "id":"3", "error": false },
      { "id":"4", "error": false }
    ]
  this.getCmsPages()

  }

  // for file upload

  save() {
    this.validationError = false
    for (let prop in this.pages) {
      if(this.pages[prop].content == ""){
        this.errorContent[prop].error = true
        this.validationError = true
      }
    }
    if(!this.validationError){
     this.api.apiRequest('post', 'cms/modify', this.pages).subscribe(result => {
        if(result.status == "success"){
          this.snack.open("Content updated successfully.", 'OK', { duration: 3000 })
        } else {
          this.snack.open(result.data, 'OK', { duration: 3000 })
        }
      }, (err) => {
        console.error(err)
      }) 
    }
  }

  getCmsPages() {
    this.api.apiRequest('post', 'cms/getPages', this.pages).subscribe(result => {
      if(result.status == "success"){
        this.pages = result.data.cmsList
      } else {
        this.snack.open(result.data, 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }

}
