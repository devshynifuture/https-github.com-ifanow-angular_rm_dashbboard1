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
  dataSource = ELEMENT_DATA;
  shortDS:any[] = [{},{},{}];
  longDS:any[] = [{},{},{}];
  advisorId: any;
  longTerm: any[] = [{},{},{}];
  showErrImg:boolean = false;
  shortTerm: any[] = [{},{},{}];
  isLoading:boolean = false;
  editMode: boolean = false;
  validatorType = ValidatorType;
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
        inflationRate: parseInt(data.inflation_rate) || 0,
        type: data.type,
        categoryId: data.category_id
      };
    });
  }

  save(){
    let obj = [ this.getPostDataFormat(this.shortTerm), this.getPostDataFormat(this.longTerm)].flat();
    if(obj.length == 0) {
      return;
    }
    this.orgSetting.updateReturns(obj).subscribe(res => {
      this.eventService.openSnackBar("Data Updated Successfully");
      this.toggleEditMode();
    }, err => {
      this.eventService.openSnackBar("Error Occured");
    })

  }

}
const ELEMENT_DATA = [
  { position: 'Inflation rate', inflation_rate: '' },

];