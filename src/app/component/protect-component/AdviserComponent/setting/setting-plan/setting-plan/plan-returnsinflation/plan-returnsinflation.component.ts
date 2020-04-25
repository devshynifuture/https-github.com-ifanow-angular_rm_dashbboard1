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
    this.longDS = [{class: 'Inflation rate', inflation_rate: data.long_term_inflation_rate}]
    this.shortDS = [{class: 'Inflation rate', inflation_rate: data.short_term_inflation_rate}]
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

    const obj = {returns: returnsObj, infation: infationObj}
    
    if(obj.returns.length == 0 && obj.infation.length == 0) {
      return;
    }
    this.orgSetting.updateReturns(obj).subscribe(res => {
      this.eventService.openSnackBar("Data Updated Successfully");
      this.toggleEditMode();
    }, err => {
      this.eventService.openSnackBar("Error Occured");
    })
  }

  checkForMinMax(value, data) {
    let inflation_rate = parseFloat(data.inflation_rate || 0);
    if(value > 100) {
      this.eventService.openSnackBar("Maximum value is 100", "Dismiss");
      data.inflation_rate = inflation_rate;
      return;
    }
    if(value < 1) {
      this.eventService.openSnackBar("Minimum value is 1", "Dismiss");
      data.inflation_rate = 1;
      return;
    }
    data.inflation_rate = value;
  }
}