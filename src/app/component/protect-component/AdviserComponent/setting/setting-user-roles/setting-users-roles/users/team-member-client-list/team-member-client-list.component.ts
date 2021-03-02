import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSort } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'app-team-member-client-list',
  templateUrl: './team-member-client-list.component.html',
  styleUrls: ['./team-member-client-list.component.scss']
})
export class TeamMemberClientListComponent implements OnInit {
  id: any;
  isLoading: boolean;
  clientDatasource = new MatTableDataSource();
  displayedColumns: string[] = ['position', 'name']
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  noData: string;


  constructor(private peopleService: PeopleService,
    public dialogRef: MatDialogRef<TeamMemberClientListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.id = this.data;
    this.getClientList();
  }

  getClientList() {
    this.isLoading = true;
    this.clientDatasource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.id,
      status: 1,
      limit: -1,
      offset: -1
    };

    this.peopleService.getClientList(obj).subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.clientDatasource.data = data;
        } else {
          this.clientDatasource.data = [];
        }
      },
      err => {
        this.isLoading = false;
        this.clientDatasource.data = [];
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientDatasource.filter = filterValue.trim().toLowerCase();
    this.clientDatasource.sort = this.sort;
    if (this.clientDatasource.filteredData.length == 0) {
      this.noData = 'No mandates found';
    }
  }

  close() {
    this.dialogRef.close();
  }

}
