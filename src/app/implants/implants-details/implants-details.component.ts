import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { APIService } from 'app/api.service'

@Component({
  selector: 'app-implants-details',
  templateUrl: './implants-details.component.html',
  styleUrls: ['./implants-details.component.scss']
})
export class ImplantsDetailsComponent implements OnInit {
  id: any ="";
  implantData: any ={};
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api:APIService) {
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id
      this.getDetail()
    })
  }

  getDetail(){
    this.api.apiRequest('post', 'implant/implantView', { id: this.id }).subscribe(result => {
      if(result.status == "success") {
          this.implantData = result.data.details
      } else {
        //this.snack.open(result.data.message, 'OK', { duration: 5000 });
      }
    }, (err) => {
      console.error(err)
    })
  }

  cancel(){
    this.router.navigate(['/', 'admin', 'implant-list'])
  }


}
