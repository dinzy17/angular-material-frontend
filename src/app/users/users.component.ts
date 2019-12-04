import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'app/api.service';
import { debounce } from 'lodash';
import { ConfirmModelComponent } from 'app/confirm-model/confirm-model.component';
import { UserDetailComponent } from 'app/users/user-detail/user-detail.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private api: APIService,
    private dialog: MatDialog,
  ) { }

  usersList:any=[]
  dbUsersList:any=[]
  searchByString:any;
  displayedColumns: string[] = ['fullName', 'email', 'contactNumber', 'profession', 'status', 'emailVerified', '_id'];
  noRecords = false
  userId: string = ""
  showErrorDetails: boolean = false
  importFile: any
  recordsExists:boolean = true
  showLoader: boolean = false
  ngOnInit() {
    this.list();
  }

  list(searchString = null) {
    const req_vars = {
      query: Object.assign({ userType: "appUser"}),
      fields: { fullName:1, email:1, profession:1, contactNumber:1, _id:1, emailVerified:1, active:1 },
      offset: '',
      limit: '',
      order: {"createdOn": -1},
    }
    if(searchString) {
      let searchTrim = this.searchByString.trim();
      req_vars.query['SearchQuery'] = searchTrim;
      req_vars['search'] = true;
    }
    this.api.apiRequest("post", "user/list", req_vars).subscribe(
      result => {
        if(result.data.userList.length == 0){
          this.noRecords = true
        }else{
          this.noRecords = false
        }
        let listRes = result.data.userList
        listRes.map((o) => {
          o.activeText = o.active ? "Active" : "Inactive"
        })
        this.dbUsersList = listRes
        this.usersList =  new MatTableDataSource(listRes);
        this.usersList.paginator = this.paginator
        this.usersList.sort = this.sort
        this.recordsExists = (result.data.userList.length < 1 ? false : true)
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
    this.usersList =  new MatTableDataSource(list)
    this.usersList.paginator = this.paginator
    this.usersList.sort = this.sort
    this.recordsExists = (list.length < 1 ? false : true)
  }

  statusChange(userData:any): void {
    //this.data.header = "profileImage";
    userData.message = "Are you sure you want to change status?";
    const dialogRef = this.dialog.open(ConfirmModelComponent,{
      disableClose: false,
      data:userData
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined && result.changes == "yes"){
        this.list();
      } else {
        this.list();
      } 
    })
  }

  view(userData: any) {
    const viwDialogRef = this.dialog.open(UserDetailComponent,{
      width: '920px',
      disableClose: false,
      data:userData
    });
  }

}
