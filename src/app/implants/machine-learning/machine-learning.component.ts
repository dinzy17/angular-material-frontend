import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { APIService } from 'app/api.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { debounce } from 'lodash'


@Component({
  selector: 'app-machine-learning',
  templateUrl: './machine-learning.component.html',
  styleUrls: ['./machine-learning.component.scss']
})
export class MachineLearningComponent implements OnInit {
  collectionStatus: string = "Waiting...."
  constructor(private router: Router, private api:APIService, private snack: MatSnackBar) { }
  isDisabled = true
  ngOnInit() {
    this.getCollectionStatus()
  }
  getCollectionStatus = debounce(() => {
    this.api.apiRequest('post', 'implant/getCollectionStatus', {}).subscribe(result => {
      if(result.status == "success"){
        this.collectionStatus = result.data.description
        if(this.collectionStatus == "Training complete."){
          this.isDisabled = false
        }
      } else {
        this.snack.open("Something went wrong while fetching machine learning status!", 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }, 2000)

  startCollectionTraining = debounce(() => {
    this.isDisabled = true
    this.api.apiRequest('post', 'implant/startCollectionTraining', {}).subscribe(result => {
      if(result.status == "success"){
        this.collectionStatus = result.data.description
        if(this.collectionStatus == "Training complete."){
          this.isDisabled = false
        }
      } else {
        this.snack.open("Something went wrong while startimg machine learning!", 'OK', { duration: 3000 })
      }
      // this.getCollectionStatus()
    }, (err) => {
      console.error(err)
    })
  }, 2000)

  getImagelist = debounce(() => {
    this.api.apiRequest('post', 'implant/listImage', {}).subscribe(result => {
      if(result.status == "success"){
        console.log(result);
      } else {
        console.log(result);
        this.snack.open("Something went wrong while fetching machine learning status!", 'OK', { duration: 3000 })
      }
    }, (err) => {
      console.error(err)
    })
  }, 2000)
}
