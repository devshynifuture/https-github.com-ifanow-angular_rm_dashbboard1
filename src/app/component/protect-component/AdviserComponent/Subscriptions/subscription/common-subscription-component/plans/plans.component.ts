import {Component, HostListener, Input, OnInit} from '@angular/core';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from '../../../../../../../auth-service/authService';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
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

  @Input() componentFlag: string;
  // @Input() upperData;
  servicePlanData;
  mappedPlan = [];
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    if (this.componentFlag === 'documents') {
      this.getPlansMappedToDocument(); 
    }else if(this.componentFlag === 'plans'){
      this.getPlansMapped()
    }else {
      this.getPlansMappedToAdvisor();
    }

  }


  @HostListener('window:focus', ['$event'])
  tabActivation(event) {
    console.log('112213123y12312398123109237123123781237123712893719823 TAb activated');
  }

  @HostListener('window:blur', ['$event'])
  tabDeactivation(event) {
    console.log('112213123y12312398123109237123123781237123712893719823 TAb deactivated');
  }

  getPlansMappedToAdvisor() {
    const obj = {
      // advisorid: 12345,
      advisorId: this.advisorId,

      serviceId: this.upperData ? this.upperData.id : null
    };
    this.subService.getPlansMappedToAdvisor(obj).subscribe(
      data => this.getPlansMappedToAdvisorResponse(data)
    );
  }
  getPlansMapped(){
    const obj = {
      // advisorid: 12345,
      advisorId: this.advisorId,
      docRepoId: this.upperData ? this.upperData.documentData.documentRepositoryId : null
    };
    this.subService.plansMapped(obj).subscribe(
      data => this.getPlansMappedResponse(data)
    );
  }

  getPlansMappedResponse(data){
    console.log(data)
    this.servicePlanData = data;
    this.servicePlanData.forEach(element => {
      if (element.selected == true) {
        this.mappedPlan.push(element);
      }
    });
  }
  getPlansMappedToDocument() {
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
    console.log('service plan data', data);

    this.servicePlanData = data;
    this.servicePlanData.forEach(element => {
      if (element.selected == true) {
        this.mappedPlan.push(element);
      }
    });
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  selectServicePlan(data) {

    (data.selected) ? this.unmapPlanToService(data) : this.mapPlanToService(data);
  }

  mapPlanToService(data) {
    data.selected = true;
    console.log(data);
    this.mappedPlan.push(data);
  }

  unmapPlanToService(data) {
    data.selected = false;
    _.remove(this.mappedPlan, function (delData) {
      return delData.id == data.id;
    });
    console.log(data);
  }

  saveMapping() {
    if (this.componentFlag === 'documents') {
      this.saveDocumentPlanMapping();
    } else if(this.componentFlag === 'plans'){
      this.mapDocumentToPlan()
    }else if(this.componentFlag === 'services'){
      this.mapDocumentToPlan()
    }else {
      this.saveServicePlanMapping();
    }
  }
  mapDocumentToPlan(){
    const obj = [];
    this.mappedPlan.forEach(planData => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        documentRepositoryId:this.upperData.documentData.documentRepositoryId,
        mappedType:this.upperData.documentData.mappedType,
        mappingId: planData.id
      };
      obj.push(data);
    });
    this.subService.mapDocumentToService(obj).subscribe(
      data => this.mapPlanToServiceRes(data)
    );
  }
  mapPlanToServiceRes(data){
    this.dialogClose()
    console.log(data)
    this.eventService.openSnackBar('Service is mapped', 'OK');
  }
  saveDocumentPlanMapping() {
    const obj = [];
    this.mappedPlan.forEach(planData => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,

        planId: planData.id,
        // serviceId: this.upperData ? this.upperData.id : null
      };
      obj.push(data);
    });
    this.subService.mapPlanToServiceSettings(obj).subscribe(
      data => this.saveMappedPlansResponse(data)
    );
  }

  saveServicePlanMapping() {
    console.log('Mapped Plan', this.mappedPlan);
    console.log('clientId', this.upperData);
    const obj = [];
    if(this.mappedPlan.length==0){
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        planId: 0,
        serviceId: this.upperData ? this.upperData.id : null
      };
      obj.push(data);
    }else{
      this.mappedPlan.forEach(planData => {
        const data = {
          advisorId: this.advisorId,
  
          planId: planData.id,
          serviceId: this.upperData ? this.upperData.id : null
        };
        obj.push(data);
      });
    }
   
    console.log('Mapped Plans', obj);

    this.subService.mapPlanToServiceSettings(obj).subscribe(
      data => this.saveMappedPlansResponse(data)
    );
  }

  saveMappedPlansResponse(data) {
    if (this.mappedPlan.length === 0) {
      this.eventService.openSnackBar('No plan mapped', 'OK');
    } else{
      this.eventService.openSnackBar('Plan is mapped', 'OK');
    }
  }
}
