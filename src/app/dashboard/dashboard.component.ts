import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { APIService } from 'app/api.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { debounce } from 'lodash'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalUser: any = "No registerd users";
  totalImplant: any = "No implant added";
  constructor(private router: Router, private api:APIService, private snack: MatSnackBar) { }
  ngOnInit() {
    this.getTotalUser()
    this.getTotalImplant()
  }
  
  getTotalUser() {
    const req_vars = {
      query: Object.assign({ userType: "appUser"}),
      fields: { _id:1 },
      offset: '',
      limit: '',
      order: {"createdOn": -1},
    }
    
    this.api.apiRequest("post", "user/list", req_vars).subscribe(
      result => {
        if(result.data.totalUsers > 0){
          this.totalUser = result.data.totalUsers
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getTotalImplant() {
    const req_vars = {
      query: Object.assign({}),
      fields: { _id:1 },
      offset: '',
      limit: '',
      order: {"createdOn": -1},
    }
    this.api.apiRequest("post", "implant/list", req_vars).subscribe(
      result => {
        if(result.data.totalImplant > 0) {
          this.totalImplant = result.data.totalImplant
        }
      },
      err => {
        
      }
    );
  }

  implant(){
    this.router.navigate(['/', 'admin', 'implant-list'])
  }

}
