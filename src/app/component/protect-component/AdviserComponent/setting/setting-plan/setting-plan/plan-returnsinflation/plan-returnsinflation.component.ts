import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';


@Component({
  selector: 'app-plan-returnsinflation',
  templateUrl: './plan-returnsinflation.component.html',
  styleUrls: ['./plan-returnsinflation.component.scss']
})
export class PlanReturnsinflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  shortDS:any[] = [{},{},{}];
  longDS:any[] = [{},{},{}];
  advisorId: any;
  longTerm: any[] = [{},{},{}];
  showErrImg:boolean = false;
  shortTerm: any[] = [{},{},{}];
  isLoading:boolean = false;
  editMode: boolean = false;
  saveError:boolean = false;
  validatorType = ValidatorType;
  postHasError = false;
  constructor(private orgSetting: OrgSettingServiceService, private eventService: EventService) { 
    this.advisorId = AuthService.getAdvisorId()
  }

  isExtendedRow = (index, item) => item.extend;

  ngOnInit() {
    this.getAssetAllocationReturns()
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  getAssetAllocationReturns() {
    let obj = {
      advisorId: this.advisorId
    }
    this.isLoading = true;
    this.orgSetting.getRetuns(obj).subscribe(
      data => this.getReturnsRes(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.showErrImg = true;
      }
    );
  }
  
  getReturnsRes(data){
    this.setTableExtensions(data.short_term);
    this.setTableExtensions(data.long_term);
    this.shortTerm = data.short_term;
    this.longTerm = data.long_term;
    this.longDS = data.long_term_inflation_rate
    this.shortDS = data.short_term_inflation_rate
    this.longDS.forEach(data => {
      data.class = 'Inflation rate';
    })
    this.shortDS.forEach(data => {
      data.class = 'Inflation rate';
    })
    this.isLoading = false;
  }

  setTableExtensions(arr:any[]) {
    arr.forEach(data => {
      switch (data.category_id) {
        case 1:
          data['extend'] = true;
          data['type_name'] = "Asset Class";
          break;
        case 3:
          data['extend'] = true;
          data['type_name'] = "Mutual funds";
          break;
        case 5:
          data['extend'] = true;
          data['type_name'] = "Other Assets";
          break;
      }
    })
  }

  getPostDataFormat(arr:any[]){
    let editedData = arr.filter(obj => obj.edited);
    return editedData.map(data => {
      if(isNaN(parseFloat(data.inflation_rate))) {
        this.postHasError = true;
      }
      return {
        id: data.id,
        advisorId: this.advisorId,
        inflationRate: parseFloat(data.inflation_rate),
        type: data.type,
        categoryId: data.category_id
      };
    });
  }

  getPostDataInflationFormat(arr:any[]){
    let editedData = arr.filter(obj => obj.edited);
    return editedData.map(data => {
      if(isNaN(parseFloat(data.inflation_rate))) {
        this.postHasError = true;
      }
      return {
        id: data.id,
        advisorId: this.advisorId,
        inflationRate: parseFloat(data.inflation_rate),
        type: data.type,
      };
    });
  }

  save(){
    this.postHasError = false;
    const returnsObj = [ this.getPostDataFormat(this.shortTerm), this.getPostDataFormat(this.longTerm)].flat();
    const infationObj = [this.getPostDataInflationFormat(this.longDS), this.getPostDataInflationFormat(this.shortDS)].flat();

    const obj = {returns: returnsObj, inflation: infationObj}
    
    if(this.postHasError) {
      this.eventService.openSnackBar("Please enter value in all fields", "Dismiss");
      return;
    }
    if(obj.returns.length == 0 && obj.inflation.length == 0) {
      this.toggleEditMode();
      return;
    }
    this.orgSetting.updateReturns(obj).subscribe(res => {
      this.eventService.openSnackBar("Data Updated Successfully");
      this.toggleEditMode();
    }, err => {
      this.eventService.openSnackBar("Error Occured");
    })
  }

  checkForMinMax(elem, data) {
    if(parseFloat(elem.value) > 100) {
      this.eventService.openSnackBar("Maximum value is 100", "Dismiss");
      data.inflation_rate = '100'
      elem.value = '100'
      return;
    }
    if(parseFloat(elem.value) < 1) {
      this.eventService.openSnackBar("Minimum value is 1", "Dismiss");
      data.inflation_rate = '1';
      elem.value = '1'
      return;
    }
    data.inflation_rate = elem.value;
  }
}