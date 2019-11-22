import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { APIService } from 'app/api.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { debounce } from 'lodash'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  collectionStatus: string = "Waiting...."

  constructor(private router: Router, private api:APIService, private snack: MatSnackBar,) { }
  ngOnInit() {
      this.getCollectionStatus()
  }

  getCollectionStatus = debounce(() => {
    this.api.apiRequest('post', 'implant/getCollectionStatus', {}).subscribe(result => {
      if(result.status == "success"){
        this.collectionStatus = result.data.description
      } else {
        this.snack.open("Something went wrong while fetching machine learning status!", 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }, 2000)

  startCollectionTraining = debounce(() => {
    this.api.apiRequest('post', 'implant/startCollectionTraining', {}).subscribe(result => {
      if(result.status == "success"){
        this.collectionStatus = result.data.description
      } else {
        this.snack.open("Something went wrong while startimg machine learning!", 'OK', { duration: 3000 })
      }
      // this.getCollectionStatus()
    }, (err) => {
      console.error(err)
    })
  }, 2000)

}
