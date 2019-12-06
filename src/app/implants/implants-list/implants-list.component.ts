import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router} from '@angular/router'
import { MatPaginator, MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'app/api.service';
import { debounce } from 'lodash';
import { ImplantsDetailsComponent } from 'app/implants/implants-details/implants-details.component';

@Component({
  selector: 'app-implants-list',
  templateUrl: './implants-list.component.html',
  styleUrls: ['./implants-list.component.scss']
})
export class ImplantsListComponent implements OnInit {
  
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private api: APIService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  implantList:any=[]
  dbImplantList:any=[]
  searchByString:any;
  displayedColumns: string[] = ['manufacturer', 'name', 'createdOn', '_id'];
  noRecords = false
  showErrorDetails: boolean = false
  recordsExists:boolean = true
  showLoader: boolean = false

  ngOnInit() {
    this.list();
  }

  list(searchString = null) {
    const req_vars = {
      query: Object.assign({}),
      fields: {},
      offset: '',
      limit: '',
      order: {"createdOn": -1},
    }
    if(searchString) {
      let searchTrim = this.searchByString.trim();
      req_vars.query['SearchQuery'] = searchTrim;
      req_vars['search'] = true;
    }
    this.api.apiRequest("post", "implant/list", req_vars).subscribe(
      result => {
        if(result.data.implantList.length == 0){
          this.noRecords = true
        }else{
          this.noRecords = false
        }
        let listRes = result.data.implantList
        this.dbImplantList = listRes
        this.implantList =  new MatTableDataSource(listRes);
        this.implantList.paginator = this.paginator
        this.implantList.sort = this.sort
        this.recordsExists = (result.data.implantList.length < 1 ? false : true)
      },
      err => {
        console.error(err);
      }
    );
  }

  searchBy(){
    let searchTrim = this.searchByString.trim();
    this.list(searchTrim);
  }

  //function to set list
  setList(list) {
    this.implantList =  new MatTableDataSource(list)
    this.implantList.paginator = this.paginator
    this.implantList.sort = this.sort
    this.recordsExists = (list.length < 1 ? false : true)
  }

  view(implantData: any) {
   // implantData._id= new Buffer(implantData._id.toString()).toString('base64');
    this.router.navigate(['/', 'admin', 'implant-view', implantData._id]) 
  }
  
}
