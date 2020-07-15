import { Component, OnInit } from '@angular/core';
import { AdvisorMarketplaceService } from '../../advisor-marketplace.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators , FormArray } from '@angular/forms';

@Component({
  selector: 'app-marketplace-calls',
  templateUrl: './marketplace-calls.component.html',
  styleUrls: ['./marketplace-calls.component.scss']
})
export class MarketplaceCallsComponent implements OnInit {
timeArr = ["01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:20", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"]
advisorId:any;
callDetails;
 displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','mail','deatils','menus'];
  dataSource = ELEMENT_DATA;
  constructor(private advisorMarketplaceService: AdvisorMarketplaceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getCallDetails();
  }

  getCallDetails(){
    const obj = {
      advisorId: this.advisorId,
    }
    this.advisorMarketplaceService.getCallDetails(obj).subscribe((data)=>{
      this.setCallData(data);
    });
  }

  setCallData(data){
    this.callDetails = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        callSettingsId: 0,
        id: 0,
        isClient: 0
      })]),
      callDurationId: [data.callDurationId, [Validators.required]],
      rollingDays: [data.rollingDays, [Validators.required]],
      startTime: [data.startTime, [Validators.required]],
      endTime: [data.endTime, [Validators.required]],
      description: [data.description, [Validators.required]],
    });
    console.log(this.callDetails.value,"callDetails");
  }
 
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  mail:string;
  deatils:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '01/02/2020', name: '11.00 AM - 11.30 AM (30 mins)', weight: 'Rahul Jain', symbol: '9874539874',mail:'Rahuljain@mail.com',deatils:'Views'},
 
];