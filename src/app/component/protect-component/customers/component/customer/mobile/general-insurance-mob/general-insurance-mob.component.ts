import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-general-insurance-mob',
  templateUrl: './general-insurance-mob.component.html',
  styleUrls: ['./general-insurance-mob.component.scss']
})
export class GeneralInsuranceMobComponent implements OnInit {
  @Output() outputValue = new EventEmitter<any>();
  advisorId: any;
  clientId: any;
  fireCv: any;
  HomewCv: any;
  travelCv: any;
  motorCv: any;
  criticalIllnessCv: any;
  personalAccidentCv: any;
  HealthCv: any;
  totalCurrentValue = 0;
  helathData: any;
  personalAccidentData: any;
  criticalIllnesData: any;
  motorData: any;
  travelData: any;
  homeData: any;
  fireData: any;
  healthData: any;
  showDetail;
  assetSubType = {assetType:'',data:''};

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getHealthInsurance();
    this.getPersonalAccidentInsurance();
    this.getCriticalIllnessInsurance();
    this.getMotorInsurance();
    this.getTravelInsurance();
    this.getHomeInsurance();
    this.getFireInsurance();
  }
  getHealthInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 5,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.healthData = data;
          this.HealthCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getPersonalAccidentInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 7,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.personalAccidentData = data;
          this.personalAccidentCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getCriticalIllnessInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 6,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.criticalIllnesData = data;
          this.criticalIllnessCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getMotorInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 4,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.motorData = data;
          this.motorCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getTravelInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 8,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.travelData = data;
          this.travelCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getHomeInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 10,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.homeData = data;
          this.HomewCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getFireInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 1,
      insuranceTypeId: 1
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.fireData =data;
          this.fireCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
  calculateSum(){
    console.log('persolena',this.personalAccidentCv)
   this.totalCurrentValue = (this.HealthCv ? this.HealthCv : 0) +
   (this.personalAccidentCv ? this.personalAccidentCv : 0 )+ (this.criticalIllnessCv ? this.criticalIllnessCv : 0)
   +(this.motorCv ? this.motorCv : 0)+(this.travelCv ? this.travelCv : 0)+
   (this.HomewCv ? this.HomewCv : 0)+(this.fireCv ? this.fireCv : 0)

   console.log('totalCV',this.totalCurrentValue)
  }
  openSubAsset(subAsset,value) {
    this.assetSubType.assetType = subAsset;
    this.assetSubType.data = value;
  }
}
