import { element } from 'protractor';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { MapClientTeamMemberComponent } from '../map-client-team-member/map-client-team-member.component';

@Component({
  selector: 'app-client-assignment',
  templateUrl: './client-assignment.component.html',
  styleUrls: ['./client-assignment.component.scss']
})
export class ClientAssignmentComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  obj: any[];
  isLoading: boolean;
  showMappingBtn: boolean = false;
  constructor(private backOfficeService: BackOfficeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getClientForAssignment()
    this.obj = []
  }
  getClientForAssignment() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true
    const obj = {
      adminId: AuthService.getAdminId()///5125
    };
    this.backOfficeService.getClientForAssignment(obj).subscribe(
      data => {
        this.isLoading = false
        console.log('getClientForAssignment ==', data)
        this.dataSource.data = data
        if (data == null) {
          this.dataSource.data = []
        }
        console.log(this.dataSource)
      }
    );
  }
  checkAll(value, event) {
    console.log('check', value)
    console.log('event', event)
    if (event.checked) {
      this.showMappingBtn = true
    }
    this.mapClient(value, event)
  }
  openFolio(data) {

  }
  selectedClient() {
    const dialogRef = this.dialog.open(MapClientTeamMemberComponent, {
      width: '663px',
      data: this.obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.hasOwnProperty('refresh') && result.refresh) {
      }
    });
  }
  mapClient(value, event) {
    if (value == '') {
      if (event.checked == true) {
        this.obj = []
        this.dataSource.data.forEach(element => {
          element.checked = true
          this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': element.clientId })
        });
      } else {
        this.dataSource.data.forEach(element => {
          this.obj = []
          element.checked = true
        });
      }
    } else {
      this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': value.clientId })
    }
  }

}
export interface PeriodicElement {
  name: string;
  // position: number;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul jain', weight: 'ASIPT7412A' },

];
