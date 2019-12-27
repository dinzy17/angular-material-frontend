import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'app/api.service';
import { debounce } from 'lodash';
import { SupportEditComponent } from 'app/supports/support-edit/support-edit.component';

@Component({
  selector: 'app-supports',
  templateUrl: './supports.component.html',
  styleUrls: ['./supports.component.scss']
})
export class SupportsComponent implements OnInit {
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private api: APIService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  supportList:any=[]
  dbSupportList:any=[]
  searchByString:any;
  displayedColumns: string[] = ['name', 'senderEmail', 'query', 'sendReplay','createdOn', '_id'];
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
      fields: { name:1, senderEmail:1, query:1, replay:1, sendReplay:1, _id:1, createdOn:1 },
      offset: '',
      limit: '',
      order: { "createdOn": -1 },
    } 
    if(searchString) {
      let searchTrim = this.searchByString.trim();
      req_vars.query['SearchQuery'] = searchTrim;
      req_vars['search'] = true;
    }
    this.api.apiRequest("post", "support/list", req_vars).subscribe(
      result => {
        if(result.data.supportList.length == 0){
          this.noRecords = true
        }else{
          this.noRecords = false
        }
        let listRes = result.data.supportList
        listRes.map((o) => {
          o.sendReplay = o.sendReplay ? "Yes" : "No"
        })
        this.dbSupportList = listRes
        this.supportList =  new MatTableDataSource(listRes);
        this.supportList.paginator = this.paginator
        this.supportList.sort = this.sort
        this.recordsExists = (result.data.supportList.length < 1 ? false : true)
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

  view(userData: any) {
    const viwDialogRef = this.dialog.open(SupportEditComponent,{ 
      width: '920px',
      disableClose: false,
      data:userData
    });
    viwDialogRef.afterClosed().subscribe(result => {
      this.list();
    })
  } 

}
