import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionService } from '../../../subscription.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})

export class ServicesComponent implements OnInit {
  @Output() changeServiceData = new EventEmitter();
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
  advisorId;

  @Input() componentFlag: string;
  planServiceData: Array<any> = [{ selected: false }, { selected: false }, { selected: false }];
  mappedData = [];
  mappedPlan = [];
  @Input() planData;
  _upperData: any;
  isLoading = false;
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

  constructor(private eventService: EventService,
    private subService: SubscriptionService, private subinject: SubscriptionInject) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log('plan ngOnInit', this.componentFlag);

    // this.getPlanServiceData();
    if (this.componentFlag === 'services') {
      this.getServicesMapped()
    } else {
      this.getPlanServiceData();
    }

    this.mappedData = [];
    console.log('upperdata', this.planData)
  }

  getPlanServiceData() {
    this.isLoading = true;
    const obj = {
      // advisorId: 12345,
      advisorId: this.advisorId,
      planId: this.planData ? this.planData.id : null
    };

    this.subService.getSettingPlanServiceData(obj).subscribe(
      data => this.getPlanServiceDataResponse(data), error => {
        this.isLoading = false;
        this.planServiceData = [];
      }
    );
  }


  getPlanServiceDataResponse(data) {
    console.log('plan service', data);
    this.isLoading = false;
    for(let S of data){
      S['read'] = false;
    }
    this.planServiceData = data;
    if (data) {

      this.planServiceData.forEach(element => {
        const newElement = {
          ...element,
          ...element.servicePricing
        };
        if (element.selected == true) {
          this.mappedData.push(element);
        }
      });


    } else {
      this.planServiceData = [];
    }
  }
  getServicesMapped() {
    this.isLoading = true;
    const obj = {
      // advisorid: 12345,
      advisorId: this.advisorId,
      docRepoId: this.upperData ? this.upperData.documentData.documentRepositoryId : null
    };
    // this.planServiceData = [{}, {}, {}];
    this.subService.servicesMapped(obj).subscribe(
      data => this.servicesMappedRes(data)
    );
  }
  servicesMappedRes(data) {
    this.isLoading = false;
    if (data) {
      console.log(data, "servicePricing");
      this.planServiceData = data;
      const modifiedArray = []
      this.planServiceData.forEach(element => {
        // const newElement = {
        //   ...element,
        //   ...element.servicePricing
        // };
        // const newElement = {
        
          if (element.selected == true) {
            this.mappedData.push(element);
          }
          element.servicePricing['pricingList'] = element.servicePricing;
        // };
        modifiedArray.push(element);
      });

      this.planServiceData = modifiedArray;
      console.log('plan service getPlanServiceDataResponse : ', modifiedArray);

    } else {
      this.planServiceData = [];

    }
  }
  selectService(data, index) {
    if (!this.isLoading) {
      (data.selected) ? this.unmapPlanToService(data) : this.mapPlanToService(data, index);
      console.log(data);
    }
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  mapPlanToService(data, index) {
    data.selected = true;
    this.mappedData.push(data);
    console.log(this.mappedData.length);
  }

  unmapPlanToService(data) {
    // data.selected = false;
    // _.reject(this.mappedData, delData => {
    //   return delData.id == data.id;
    // });
    data.selected = false;
    // _.remove(this.mappedData, function (delData) {
    //   return delData.id == data.id;
    // });
    this.mappedData = this.mappedData.filter(delData => delData.id != data.id)
    console.log(data);
    // console.log(this.mappedData.length);
  }

  

  savePlanMapToService() {
    this.barButtonOptions.active = true;
    if (this.componentFlag === 'services') {
      this.mapDocumentToPlan()
    } else {
      this.saveServicePlanMapping();
    }

  }

  mapDocumentToPlan() {
    const obj = [];
    this.mappedData.forEach(planData => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        documentRepositoryId: this.upperData.documentData.documentRepositoryId,
        mappedType: this.upperData.documentData.mappedType,
        mappingId: planData.id
      };
      obj.push(data);
    });
    this.subService.mapDocumentToService(obj).subscribe(
      data =>{
        this.mapPlanToServiceRes(data)
      },
      err =>{
        console.log(err,"error mapPlanToServiceRes");
        this.barButtonOptions.active = false;
      }
    );
  }
  mapPlanToServiceRes(data) {
    console.log(data)
    this.changeServiceData.emit(true);
    this.eventService.openSnackBar('Service is mapped', 'OK');
    this.barButtonOptions.active = false;
    // this.dialogClose()
  }
  savePlanMapToServiceResponse(data) {
    console.log("map plan to service Data", data)
    if (this.mappedData.length === 0) {
      this.eventService.openSnackBar('No service mapped', 'OK');

    } else {
      this.eventService.openSnackBar('Service is mapped', 'OK');

    }
    this.changeServiceData.emit(true);
    this.barButtonOptions.active = false;
  }
  saveServicePlanMapping() {
    const obj = [];
    if (this.mappedData.length == 0) {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        global: 'false',
        id: 0,
        planId: this.planData ? this.planData.id : null
      };
      obj.push(data);
    } else {
      this.mappedData.forEach(element => {
        const data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          global: element.global,
          id: element.id,
          planId: this.planData ? this.planData.id : null
        };
        obj.push(data);
      });
    }

    console.log(obj);
    this.subService.mapServiceToPlanData(obj).subscribe(
      data =>{
        this.savePlanMapToServiceResponse(data);
      },
      err =>{
        console.log(err,"error savePlanMapToServiceResponse");
        this.barButtonOptions.active = false;
      }
    );
  }
}
