import {Component, HostListener, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
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
  };
  _upperData: any;
  flag: any;

  constructor(private subService: SubscriptionService, private eventService: EventService,
              private router: Router, private location: Location) {
  }

  @Output() changePlanData = new EventEmitter();


  @Input() set upperData(upperData) {
    console.log(' upperData plan : ', upperData);
    this.flag = upperData.flag;
    this._upperData = upperData;
    if (upperData && upperData.documentData && upperData.documentData.documentTypeId) {
      if (upperData.documentData.documentTypeId == 7) {
        this.isQuotation = true;
      }
    }
  }

  isQuotation = false;

  get upperData(): any {
    return this._upperData;
  }

  @Input() componentFlag: string;
  // @Input() upperData;
  servicePlanData = [{selected: false}, {selected: false}, {selected: false}];
  isLoading = false;
  mappedPlan = [];
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log(' ngOnInit componentFlag : ', this.componentFlag);

    if (this.componentFlag === 'documents') {
      this.getPlansMappedToDocument();
    } else if (this.componentFlag === 'plans') {
      this.getPlansMapped();
    } else {
      this.getPlansMappedToAdvisor();
    }

  }


  @HostListener('window:focus', ['$event'])
  tabActivation(event) {
  }

  @HostListener('window:blur', ['$event'])
  tabDeactivation(event) {
  }

  getPlansMappedToAdvisor() {
    this.isLoading = true;
    const obj = {
      // advisorid: 12345,
      advisorId: this.advisorId,
      serviceId: this.upperData ? this.upperData.id : null
    };
    this.subService.getPlansMappedToAdvisor(obj).subscribe(
      data => this.getPlansMappedToAdvisorResponse(data)
    );
  }

  getPlansMapped() {
    this.isLoading = true;

    this.subService.plansMapped(this.advisorId, this.upperData ? this.upperData.documentData.documentRepositoryId : null).subscribe(
      data => this.getPlansMappedResponse(data)
    );
  }

  getPlansMappedResponse(data) {
    this.isLoading = false;
    // if(this.servicePlanData && this.servicePlanData !== null && this.servicePlanData !== undefined){
    if (data) {
      this.servicePlanData = data;
      this.servicePlanData.forEach(element => {
          if (element.selected == true) {
            this.mappedPlan.push(element);
          }
        }
      );
    } else {
      this.servicePlanData = [];
    }


  }

  getPlansMappedToDocument() {
    this.isLoading = true;
    const obj = {
      // advisorid: 12345,`
      advisorId: this.advisorId,
      docRepoId: this.upperData ? this.upperData.documentRepositoryId : null
    };
    this.subService.getPlansMappedToAdvisor(obj).subscribe(
      data => this.getPlansMappedToAdvisorResponse(data)
    );
  }

  getPlansMappedToAdvisorResponse(data) {
    this.isLoading = false;

    if (data && data !== undefined && data !== null) {
      for (const p of data) {
        p.read = false;
      }
      this.servicePlanData = data;
      this.servicePlanData.forEach(element => {
        if (element.selected == true) {
          this.mappedPlan.push(element);
        }
      });
    } else {
      this.servicePlanData = [];
    }
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  selectServicePlan(data) {

    // if (this.isQuotation && !data.selected && this.mappedPlan.length > 0) {
    //   return;
    // }
    (data.selected == true) ? this.unmapPlanToService(data) : this.mapPlanToService(data);
  }

  mapPlanToService(data) {
    data.selected = true;
    this.mappedPlan.push(data);
  }

  unmapPlanToService(data) {
    data.selected = false;
    // _.remove(this.mappedPlan, function (delData) {
    //   return delData.id == data.id;
    // });
    this.mappedPlan = this.mappedPlan.filter(delData => delData.id != data.id);
  }

  saveMapping() {
    this.barButtonOptions.active = true;

    if (this.componentFlag === 'documents') {
      this.saveDocumentPlanMapping();
    } else if (this.componentFlag === 'plans') {
      this.mapDocumentToPlan();
    } else if (this.componentFlag === 'services') {
      this.mapDocumentToPlan();
    } else {
      this.saveServicePlanMapping();
    }
  }

  mapDocumentToPlan() {
    let obj = [];
    if (this.mappedPlan && this.mappedPlan !== null && this.mappedPlan !== undefined) {
      this.mappedPlan.forEach(planData => {
        const data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          documentRepositoryId: this.upperData.documentData.documentRepositoryId,
          mappedType: this.upperData.documentData.mappedType,
          mappingId: planData.id
        };
        obj.push(data);
      });
    }
    if (obj.length === 0) {
      obj = [
        {
          advisorId: this.advisorId,
          documentRepositoryId: this.upperData.documentData.documentRepositoryId,
          mappedType: this.upperData ? this.upperData.documentData.mappedType : null,
          mappingId: null
        }
      ];
    }
    this.subService.mapDocumentToService(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.mapPlanToServiceRes(data);
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }

  mapPlanToServiceRes(data) {
    // this.dialogClose()
    this.changePlanData.emit(this.upperData);
    this.eventService.openSnackBar('Plans is mapped', 'OK');
    this.router.navigate(['/admin/subscription/settings', 'documents']);
    this.location.replaceState('/admin/subscription/settings/documents');
    this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
  }

  saveDocumentPlanMapping() {
    let obj = [];
    if (this.mappedPlan && this.mappedPlan !== undefined && this.mappedPlan !== null) {
      this.mappedPlan.forEach(planData => {
        const data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          planId: planData.id,
          // serviceId: this.upperData ? this.upperData.id : null
        };
        obj.push(data);
      });
    }
    if (obj.length === 0) {
      obj = [
        {
          advisorId: this.advisorId,
          planId: 0,
        }
      ];
    }
    this.subService.mapPlanToServiceSettings(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.saveMappedPlansResponse(data);
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }

  saveServicePlanMapping() {
    const obj = [];
    if (this.mappedPlan.length == 0) {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        planId: 0,
        serviceId: this.upperData ? this.upperData.id : null
      };
      obj.push(data);
    } else {
      this.mappedPlan.forEach(planData => {
        const data = {
          advisorId: this.advisorId,

          planId: planData.id,
          serviceId: this.upperData ? this.upperData.id : null
        };
        obj.push(data);
      });
    }


    this.subService.mapPlanToServiceSettings(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.saveMappedPlansResponse(data);
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }

  saveMappedPlansResponse(data) {
    if (this.mappedPlan.length === 0) {
      this.eventService.openSnackBar('No plan mapped', 'OK');
    } else {
      this.eventService.openSnackBar('Plan is mapped', 'OK');
    }
    this.changePlanData.emit(this.upperData);
  }
}
