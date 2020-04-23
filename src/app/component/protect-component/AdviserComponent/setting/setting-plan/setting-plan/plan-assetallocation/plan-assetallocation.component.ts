import { Component, OnInit, Directive } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { element } from 'protractor';

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
  editMode: boolean = false;
  dataToMap: any = [];
  onlyNumbers: string;
  staticAllocationData: any[] = [{}, {}, {}];
  secondValue: any;
  obj: any;
  hasError = false;
  obj1: any;
  obj2: any;
  obj3: any;
  obj4: any;
  isLoading = true;
  staticAllocation: any;
  validatorType = ValidatorType;
  constructor(
    private orgSetting: OrgSettingServiceService,
    private eventService: EventService,
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }
  ngOnInit() {
    this.getAssetAllocation()
    this.editMode = false
    console.log('edit mode', this.editMode)
    this.staticAllocation = []
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log('hgdsfhg ==', this.editMode)
  }
  changeTableTdValue(value, field, field2, ele, index) {
    console.log(value, field, index);
    if (value > 100) {
      value = 100;
    }
    this.secondValue = 100 - value
    ele[field2] = this.secondValue
    ele[field] = value

    if (ValidatorType.NUMBER_ONLY.test(value)) {
      // const updatedTable = this.orgSetting.alterTable(this.dataToMap, field, value, index);
      // console.log("this is updated Table", updatedTable);
      // this.dataSource.data = updatedTable;
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This input only takes numbers", "Dismiss");
    }
  }
  save() {
    this.staticAllocation = []
    this.staticAllocationData.forEach(element => {
      this.obj = {
        advisorId: this.advisorId,
        riskProfileMasterId: element.riskProfileMasterI1,
        goalTimeFrameMasterId: element.goalTimeFrameMasterId1,
        equityAllocation: element.equity1,
        debtAllocation: element.debt1,
      }
      this.obj1 = {
        advisorId: this.advisorId,
        riskProfileMasterId: element.riskProfileMasterI2,
        goalTimeFrameMasterId: element.goalTimeFrameMasterId2,
        equityAllocation: element.equity2,
        debtAllocation: element.debt2,
      }
      this.obj2 = {
        advisorId: this.advisorId,
        riskProfileMasterId: element.riskProfileMasterI3,
        goalTimeFrameMasterId: element.goalTimeFrameMasterId3,
        equityAllocation: element.equity3,
        debtAllocation: element.debt3,
      }
      this.obj3 = {
        advisorId: this.advisorId,
        riskProfileMasterId: element.riskProfileMasterI4,
        goalTimeFrameMasterId: element.goalTimeFrameMasterId4,
        equityAllocation: element.equity4,
        debtAllocation: element.debt4,
      }
      this.obj4 = {
        advisorId: this.advisorId,
        riskProfileMasterId: element.riskProfileMasterI5,
        goalTimeFrameMasterId: element.goalTimeFrameMasterId5,
        equityAllocation: element.equity5,
        debtAllocation: element.debt5,
      }
      this.staticAllocation.push(this.obj)
      this.staticAllocation.push(this.obj1)
      this.staticAllocation.push(this.obj2)
      this.staticAllocation.push(this.obj3)
      this.staticAllocation.push(this.obj4)

    });
    console.log('sgdfg == ', this.staticAllocation)
    this.orgSetting.updateAssetAllocation(this.staticAllocation).subscribe(
      data => this.updateAssetAllocationRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  updateAssetAllocationRes(data) {
    console.log('updateAssetAllocationRes', data)
  }
  getAssetAllocation() {
    this.isLoading = true
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getAssetAllocation(obj).subscribe(
      data => this.getAssetAllocationRes(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }
  getAssetAllocationRes(data) {
    this.isLoading = false
    console.log('getAssetAllocationRes', data)
    this.staticAllocationData = data.staticAllocationData
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