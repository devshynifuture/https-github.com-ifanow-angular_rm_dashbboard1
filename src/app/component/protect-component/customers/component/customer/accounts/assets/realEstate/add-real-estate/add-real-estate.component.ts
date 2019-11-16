import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-real-estate',
  templateUrl: './add-real-estate.component.html',
  styleUrls: ['./add-real-estate.component.scss']
})
export class AddRealEstateComponent implements OnInit {
  addrealEstateForm: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  advisorId: any;
  addOwner: boolean;
  showMoreData: boolean;
  showLessData: boolean;
  showArea: boolean;
  showNominee: boolean;
  estateDays:string[];
  estateMonths:string[];
  tenure: any;
  getDate: any;
  datePipe: any;
  getValue: any;
  year: any;
  month: any;
  days: any;
  purchasePeriod: any;

  constructor(public subInjectService:SubscriptionInject,private fb: FormBuilder) { }

  ngOnInit() {
    this.addOwner=false;
    this.showMoreData=false;
    this.showArea=false;
    this.showNominee=false;
    this.advisorId = AuthService.getAdvisorId();
    this.getRealEstate('');
    this.estateDays= ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.estateMonths=['January','February','March','April','May','June','July','August','September','October','November','December']
  }

  close(){
     this.subInjectService.changeNewRightSliderState({ state: 'close' });
   }
   getFormControl() {
    return this.addrealEstateForm.controls;
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  addCoOwner(){
    this.addOwner=true;
  }
  removeCoOwner(){
    this.addOwner=false;
  }
  showMore(){
    this.showMoreData=true;
  }
  showLess(){
    this.showMoreData=false;
  }
  addArea(){
    this.showArea=true;
  }
  removeArea(){
    this.showArea=false;
  }
  // addNominee(){
  //   this.showNominee=true
  // }
 
  getDateYMD(){
    this.year =new Date(this.addrealEstateForm.controls.year.value,this.addrealEstateForm.controls.month.value,this.addrealEstateForm.controls.days.value);
    this.purchasePeriod=this.year.toISOString().slice(0, 10);
  }
  get getNominee() {
    return this.addrealEstateForm.get('getNomineeName') as FormArray;
  }
  addNominee(){
      this.getNominee.push(this.fb.group({ nomineeName: null,
        ownershipPer: null,
      }));
    
  }
  removeNominee(item){
    // this.showNominee=false
    if(this.getNominee.value.length>1){
      this.getNominee.removeAt(item);
    }

  }
   getRealEstate(data){
    if (data == undefined) {
      data = {};
    }
    this.addrealEstateForm = this.fb.group({
      ownerName:this.ownerName,
      ownerPercent: [data.ownerPercent , [Validators.required]],
      coOwnerPercent: [(data.coOwnerPercent)+"", [Validators.required]],
      type: [data.type, [Validators.required]],
      marketValue: [data.marketValue, [Validators.required]],
      year:[data.year],
      month: [data.month, [Validators.required]],
      days:[data.days,[Validators.required]],
      purchaseValue: [data.purchaseValue, [Validators.required]],
      unit: [data.unit, [Validators.required]],
      ratePerUnit: [data.ratePerUnit, [Validators.required]],
      stampDuty: [data.stampDuty, [Validators.required]],
      registration: [data.registration],
      gst: [data.gst],
      location: [data.location],
      description: [data.description],
      nominee: [data.nominee],
      getNomineeName: this.fb.array([this.fb.group({  nomineeName:null,
        ownershipPer: null,
       })])
    });
    this.ownerData = this.addrealEstateForm.controls;

    }
   saveFormData(){
    this.getValue=this.getDateYMD()
     console.log(this.getValue);
      const obj = {
        ownerName:this.ownerName,
        ownerPercent:this.addrealEstateForm.controls.ownerPercent.value,
        coOwnerPercent:this.addrealEstateForm.controls.coOwnerPercent.value,
        type:this.addrealEstateForm.controls.type.value,
        marketValue:this.addrealEstateForm.controls.marketValue.value,
        year:this.addrealEstateForm.controls.year.value,
        month:this.addrealEstateForm.controls.month.value,
        days:this.addrealEstateForm.controls.days.value,
        purchaseValue:this.addrealEstateForm.controls.purchaseValue.value,
        unit:this.addrealEstateForm.controls.unit.value,
        ratePerUnit:this.addrealEstateForm.controls.ratePerUnit.value,
        stampDuty:this.addrealEstateForm.controls.stampDuty.value,
        registration:this.addrealEstateForm.controls.registration.value,
        gst:this.addrealEstateForm.controls.gst.value,
        location:this.addrealEstateForm.controls.location.value,
        description:this.addrealEstateForm.controls.description.value,
        nominee:this.addrealEstateForm.controls.nominee.value,
        }
        let objToSend={
          "clientId": 2978,
            "advisorId": this.advisorId,
            "typeId": obj.type,
            "marketValue": obj.marketValue,
            "purchasePeriod": "2019-10-14",
            "purchaseValue": obj.purchaseValue,
            "unitId": obj.unit,
            "ratePerUnit": obj.ratePerUnit,
            "stampDutyCharge": obj.stampDuty,
            "registrationCharge": obj.registration,
            "gstCharge": obj.gst,
            "location": obj.location,
            "description": obj.location,
            "realEstateOwners": [
            {
            "ownerName":this.ownerName,
            "familyMemberId":2978,
            "ownershipPerc":obj.ownerName
            },{
            "ownerName":"Shyam",
            "familyMemberId":2978,
            "ownershipPerc":obj.coOwnerPercent
            }
            ],
            "realEstateNominees":[
            {
            "name":obj.nominee,
            "familyMemberId":2978,
            "ownershipPer":50
            },{
            "name":obj.nominee,
            "familyMemberId":2978,
            "ownershipPer":50
            }
            ]
        }
        console.log(obj);
   }

}
