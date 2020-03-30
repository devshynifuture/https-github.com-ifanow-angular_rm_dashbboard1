import { Component, OnInit, Directive } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-plan-assetallocation',
  templateUrl: './plan-assetallocation.component.html',
  styleUrls: ['./plan-assetallocation.component.scss']
})

export class PlanAssetallocationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'debt1', 'equity1', 'debt2', 'equity2', 'debt3', 'equity3',
    'debt4', 'equity4', 'debt5', 'equity5'];
  dataSource = ELEMENT_DATA;
  advisorId: any;
  mode1: any;
  mode3: any;
  mode2: any;
  mode4: any;
  mode5: any;
  editMode: boolean =false;
  dataToMap: any = [];
  onlyNumbers: string;
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService) { }
  ngOnInit() {
    this.getAssetAllocation()
    this.advisorId = AuthService.getAdvisorId()
    this.editMode=false
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  changeTableTdValue(value: string, field: string, index: number) {
    console.log(value, field, index);
    if (ValidatorType.NUMBER_ONLY.test(value)) {
      const updatedTable = this.orgSetting.alterTable(this.dataToMap, field, value, index);
      console.log("this is updated Table", updatedTable);
     // this.dataSource.data = updatedTable;
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This input only takes numbers", "Dismiss");
    }
  }
  getAssetAllocation() {
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getAssetAllocation(obj).subscribe(
      data => this.getAssetAllocationRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getAssetAllocationRes(data) {
    console.log('getAssetAllocationRes', data)
    this.mode1 = data.staticAllocationData.filter(element => element.risk_profile_master_id == 1)
    this.mode2 = data.staticAllocationData.filter(element => element.risk_profile_master_id == 2)
    this.mode3 = data.staticAllocationData.filter(element => element.risk_profile_master_id == 3)
    this.mode4 = data.staticAllocationData.filter(element => element.risk_profile_master_id == 4)
    this.mode5 = data.staticAllocationData.filter(element => element.risk_profile_master_id == 5)
    console.log('mode1',this.mode1)
    console.log('mode2',this.mode2)
    console.log('mode3',this.mode3)
    console.log('mode4',this.mode4)
    console.log('mode5',this.mode5)


//     advisor_id: 0
// goal_time_frame_master_id: 1
// risk_profile_master_id: 2
// equity_allocation: 80
// debt_allocation: 20
// is_active: true
  }
}
export interface PeriodicElement {

  position: string;
  equity1: string;
  debt1: string;
  equity2: string;
  debt2: string;
  equity3: string;
  debt3: string;
  equity4: string;
  debt4: string;
  equity5: string;
  debt5: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: '> 15 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '10 - 15 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '6 - 10 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '3 - 6 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
];