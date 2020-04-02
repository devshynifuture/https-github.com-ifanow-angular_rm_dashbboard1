import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';


@Component({
  selector: 'app-plan-returnsinflation',
  templateUrl: './plan-returnsinflation.component.html',
  styleUrls: ['./plan-returnsinflation.component.scss']
})
export class PlanReturnsinflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['position', 'name'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['position', 'name'];
  dataSource4 = ELEMENT_DATA4;
  advisorId: any;
  shortTerm;
  longTerm: any;
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService) { 
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getAssetAllocationReturns()
  
  }
  getAssetAllocationReturns() {
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getRetuns(obj).subscribe(
      data => this.getReturnsRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getReturnsRes(data){
    console.log('getReturnsRes',data)
    this.shortTerm = data.short_term
    this.longTerm =data.long_term
  }

}
export interface PeriodicElement {

  position: string;
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Inflation rate', name: '7%' },

];
export interface PeriodicElement2 {

  position: string;
  name: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Inflation rate', name: '7%' },

];
export interface PeriodicElement3 {

  position: string;
  name: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Debt asset class', name: '7%' },
  { position: 'Equity asset class', name: '17%' },

];
export interface PeriodicElement4 {

  position: string;
  name: string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { position: 'Debt asset class', name: '7%' },
  { position: 'Equity asset class', name: '17%' },

];