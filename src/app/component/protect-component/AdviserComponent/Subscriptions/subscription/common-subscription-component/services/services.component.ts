import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionService } from '../../../subscription.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

    this._upperData = upperData;
    // setTimeout(() => {
    //   this.openPlanSliderFee(upperData, 'fixedFee', 'open');
    // }, 300);
  }

  get upperData(): any {
    return this._upperData;
  }

  constructor(private eventService: EventService,
    private subService: SubscriptionService, private subinject: SubscriptionInject, private router: Router, private location: Location) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

    // this.getPlanServiceData();
    if (this.componentFlag === 'services') {
      this.getServicesMapped()
    } else {
      this.getPlanServiceData();
    }

    this.mappedData = [];
  }

  getPlanServiceData() {
    this.planServiceData = [{}, {}, {}];
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
    this.isLoading = false;

    this.planServiceData = data;
    if (data) {
      for (let S of data) {
        S['read'] = false;
      }
      this.planServiceData.forEach(element => {
        // const newElement = {
        //   ...element,
        //   ...element.servicePricing
        // };
        element['feeTypeId'] = element.servicePricing.billingNature == 1
        element['billingNature'] = element.servicePricing.billingNature == 1
        element['billingMode'] = element.servicePricing.billingNature == 1
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
    this.planServiceData = [{}, {}, {}];
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
      this.planServiceData = data;
      const modifiedArray = []
      this.planServiceData.forEach(element => {
        if (element.selected == true) {
          this.mappedData.push(element);
        }
        element.servicePricing['pricingList'] = element.servicePricing;
        modifiedArray.push(element);
      });

      this.planServiceData = modifiedArray;

    } else {
      this.planServiceData = [];

    }
  }
  selectService(data, index) {
    if (!this.isLoading) {
      (data.selected) ? this.unmapPlanToService(data) : this.mapPlanToService(data, index);
    }
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  mapPlanToService(data, index) {
    data.selected = true;
    this.mappedData.push(data);
  }

  unmapPlanToService(data) {
    data.selected = false;
    this.mappedData = this.mappedData.filter(delData => delData.id != data.id)
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
    let data = {}
    if (this.mappedData.length > 0) {
      this.mappedData.forEach(planData => {
        data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          documentRepositoryId: this.upperData.documentData.documentRepositoryId,
          mappedType: this.upperData.documentData.mappedType,
          mappingId: planData.id
        };
        obj.push(data);
      });
    }
    else {
      data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        documentRepositoryId: this.upperData.documentData.documentRepositoryId,
        mappedType: this.upperData.documentData.mappedType,
        mappingId: 0
      };
      obj.push(data);
    }
    this.subService.mapDocumentToService(obj).subscribe(
      data => {
        this.mapPlanToServiceRes(data)
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }

  mapPlanToServiceRes(data) {
    this.changeServiceData.emit(this.planData);
    this.eventService.openSnackBar('Service is mapped', 'OK');
    this.barButtonOptions.active = false;
    this.router.navigate(['/admin/subscription/settings', 'documents']);
    this.location.replaceState('/admin/subscription/settings/documents');
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
    // this.dialogClose()
  }
  savePlanMapToServiceResponse(data) {
    if (this.mappedData.length === 0) {
      this.eventService.openSnackBar('No service mapped', 'OK');

    } else {
      this.eventService.openSnackBar('Service is mapped', 'OK');

    }
    this.changeServiceData.emit(this.planData);
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

    this.subService.mapServiceToPlanData(obj).subscribe(
      data => {
        this.savePlanMapToServiceResponse(data);
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }
}
