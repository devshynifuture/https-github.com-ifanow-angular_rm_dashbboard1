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
        //this.dataSource.data = data
        if (data == null) {
          // this.dataSource.data = []
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
    //this.mapClient(value)
  }
  openFolio(data) {

  }
  selectedClient() {
    const dialogRef = this.dialog.open(MapClientTeamMemberComponent, {
      width: '663px',

      data: { selectedFolios: this.obj, type: 'backoffice' }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.hasOwnProperty('refresh') && result.refresh) {
      }
    });
  }
  // searchClient(event) {
  //   this.isLoading = true
  //   if (event.length >= 3) {
  //     const obj = {
  //       advisorId: AuthService.getAdvisorId(),
  //       search: true,
  //       searchName: event
  //     };
  //     this.backOfficeService.searchByTeamMember(obj).subscribe(
  //       data => {
  //         this.isLoading = false
  //         console.log('getClientForAssignment ==', data)
  //         this.dataSource.data = data
  //         if (data == null) {
  //           this.dataSource.data = []
  //         }
  //         console.log(this.dataSource)
  //       }
  //     );
  //   }
  // }
  // mapClient(value, event) {
  //   if (value == "All" && event.checked == true) {
  //     this.dataSource.data.forEach(element => {
  //       this.obj = []
  //       this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': element.clientId })
  //     });
  //   } else {
  //     this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': value.clientId })
  //   }
  //   this.backOfficeService.mapClient(this.obj).subscribe(
  //     data => {
  //       this.isLoading = false
  //       console.log('getClientForAssignment ==', data)
  //       this.dataSource.data = data
  //       if (data == null) {
  //         this.dataSource.data = []
  //       }
  //       console.log(this.dataSource)
  //     }
  //   );
  // }
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
