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
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  constructor(private router: Router, private fb: FormBuilder, private api:APIService, private snack: MatSnackBar,) { }
  ngOnInit() {
  this.getCmsPages()
  }

  save(){
    this.api.apiRequest('post', 'cms/modify', this.pages).subscribe(result => {
      if(result.status == "success"){
        this.snack.open("Successfully added image for training!", 'OK', { duration: 3000 })
      } else {
        this.snack.open(result.data, 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }

  getCmsPages() {
    this.api.apiRequest('post', 'cms/getPages', this.pages).subscribe(result => {
      if(result.status == "success"){
        this.pages = result.data.cmsList
        console.log(this.pages);
      } else {
        this.snack.open(result.data, 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }

}
