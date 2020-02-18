import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  @Output() changeServiceData = new EventEmitter();

  _upperData: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
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
    this.eventService.changeUpperSliderState({ state: 'close' });
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
    this.ModuleData.forEach(element => {
      if (element.selected == true) {
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
    // _.remove(this.mappedData, delData => delData.subModuleId === data.subModuleId);
    this.mappedData = this.mappedData.filter(delData => delData.subModuleId != data.subModuleId)
    console.log(this.mappedData.length);
  }

  mapModuleToPlan() {
    this.barButtonOptions.active = true;
    const data = {
      serviceModuleMappingList: []
    };
    if (this.mappedData.length != 0) {
      this.mappedData.forEach(element => {
        const obj = {
          active: element.selected,
          serviceId: this.upperData.id,
          subModuleId: element.subModuleId
        };
        data.serviceModuleMappingList.push(obj);
      });
    } else {
      const obj = {
        active: true,
        serviceId: this.upperData.id,
        subModuleId: 0
      };
      data.serviceModuleMappingList.push(obj);
    }

    this.subService.mapModuleToplanData(data).subscribe(
      data =>{
        this.barButtonOptions.active = false;
        this.mapModuleToPlanResponse(data);
      },
      err =>{
        this.barButtonOptions.active = false;
        console.log(err, "error mapModuleToplanData");
      }
    );
  }

  mapModuleToPlanResponse(data) {
    // this.dialogClose();
    console.log('Module Map data', data);
    if (this.mappedData.length != 0) {
      this.eventService.openSnackBar('Module is mapped', 'OK');
    } else {
      this.eventService.openSnackBar('No module is mapped', 'OK');
    }
    this.changeServiceData.emit(true);
  }
}
