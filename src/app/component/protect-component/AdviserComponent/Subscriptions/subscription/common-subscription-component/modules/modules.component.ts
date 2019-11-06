import {Component, OnInit, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {UpperSliderComponent} from '../upper-slider/upper-slider.component';
import {EventService} from 'src/app/Data-service/event.service';
import { element } from 'protractor';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  _upperData: any;

  constructor(private subService: SubscriptionService, private eventService: EventService) {
  }
  @Input()
  set upperData(upperData) {
    console.log('FeeStructureComponent upperData set : ', this.upperData);

    this._upperData = upperData;
    // setTimeout(() => {
    //   this.openPlanSliderFee(upperData, 'fixedFee', 'open');
    // }, 300);
  }

  get upperData(): any {
    return this._upperData;
  }
  // @Input() upperData;
  ModuleData;
  mappedData = [];

  ngOnInit() {
    this.getModuleData();
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  getModuleData() {
    const obj = {
      serviceId: this.upperData.id
    };
    this.subService.getModuleServiceData(obj).subscribe(
      data => this.getModuleDataResponse(data)
    );
  }

  getModuleDataResponse(data) {
    console.log('Module data', data);
    this.ModuleData = data;
    this.ModuleData.forEach(element=>{
      if(element.selected==true)
      {
        this.mappedData.push(element)
      }
    })

  }

  selectModule(data) {
    (data.selected) ? this.unmapModuleToService(data) : this.mapModuleToService(data);
    console.log(data);
  }

  mapModuleToService(data) {
    data.selected = true;
    this.mappedData.push(data);
    console.log(this.mappedData.length);
  }

  unmapModuleToService(data) {
    data.selected = false;
    _.remove(this.mappedData, delData => delData.subModuleId === data.subModuleId);
    console.log(this.mappedData.length);
  }

  mapModuleToPlan() {
    const data = {
      serviceModuleMappingList: []
    };
    if (this.mappedData.length == 0) {
      return;
    } else {
      this.mappedData.forEach(element => {
        const obj = {
          active: element.selected,
          serviceId: this.upperData.id,
          subModuleId: element.subModuleId
        };
        data.serviceModuleMappingList.push(obj);
      });
      this.subService.mapModuleToplanData(data).subscribe(
        data => this.mapModuleToPlanResponse(data)
      );
    }

  }

  mapModuleToPlanResponse(data) {
    this.dialogClose();
    console.log('Module Map data', data);
    this.eventService.openSnackBar('Module is mapped', 'OK');
  }
}
