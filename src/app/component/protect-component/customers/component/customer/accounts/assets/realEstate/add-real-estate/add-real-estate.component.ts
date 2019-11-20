import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  family: any;
  _inputData: any;
  isTypeValid: boolean;
  isMvValid: boolean;
  clientId: any;

  constructor(public custumService:CustomerService,public subInjectService:SubscriptionInject,private fb: FormBuilder,public custmService:CustomerService,public eventService:EventService) { }
  @Input()
  set inputData(inputData) {
    this._inputData = inputData;
    this.getRealEstate(inputData);
  }

  get inputData() {
    return this._inputData;
  }
  ngOnInit() {
    this.addOwner=false;
    this.showMoreData=false;
    this.showArea=false;
    this.showNominee=false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getListFamilyMem();
    this.estateDays= ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.estateMonths=['January','February','March','April','May','June','July','August','September','October','November','December']
  }
  getListFamilyMem() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.custmService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    this.family = data.familyMembersList
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
  // removeCoOwner(){
  //   this.addOwner=false;
  // }
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
      this.getNominee.push(this.fb.group({ name: null,
        ownershipPer: null,
      }));
    
  }
  removeNominee(item){
    // this.showNominee=false
    if(this.getNominee.value.length>1){
      this.getNominee.removeAt(item);
    }

  }
  get getCoOwner() {
    return this.addrealEstateForm.get('getCoOwnerName') as FormArray;
  }
  addNewCoOwner(data){
    if(this.addOwner==data){
      this.getCoOwner.push(this.fb.group({ ownerName: null,
        ownershipPerc: null,
      }));
    }else{
      this.addOwner=data;
    }

    
  }
removeCoOwner(item){
  // this.showNominee=false
    this.getCoOwner.removeAt(item);

}
   getRealEstate(data){
    if (data == undefined) {
      data = {};
    }
    this.addrealEstateForm = this.fb.group({
      ownerName:this.ownerName,
      getCoOwnerName: this.fb.array([this.fb.group({  ownerName:null,
        coOwnerPerc: null,
       })]),
      // ownerPercent: [data.ownerPercent , [Validators.required]],
      // coOwnerPercent: [(data.coOwnerPercent)+"", [Validators.required]],
      type: [(data.typeId)+"", [Validators.required]],
      marketValue: [data.marketValue, [Validators.required]],
      year:[data.year],
      month: [data.month, [Validators.required]],
      days:[data.days,[Validators.required]],
      purchaseValue: [data.purchaseValue, [Validators.required]],
      unit: [data.unitId, [Validators.required]],
      ratePerUnit: [data.ratePerUnit, [Validators.required]],
      stampDuty: [data.stampDutyCharge, [Validators.required]],
      registration: [data.registrationCharge],
      gst: [data.gstCharge],
      location: [data.location],
      description: [data.description],
      nominee: [data.nominee],
      getNomineeName: this.fb.array([this.fb.group({  name:null,
        ownershipPer: null,
       })])
    });
    // if(data.realEstateNominees!=undefined){
    //   data.realEstateNominees.forEach(element => {
    //     this.addrealEstateForm.controls.getNomineeName=this.fb.array([this.fb.group({
    //       name: [element.name,[Validators.required]],
    //       ownershipPer:[ (element.ownershipPer),Validators.required]})])
    //   })
    // }
    if (data.realEstateNominees != undefined) {
      data.realEstateNominees.forEach(element => {
        this.addrealEstateForm.controls.getNomineeName.push(this.fb.group({
          name: [(element.name) + "", [Validators.required]],
          ownershipPer: [(element.ownershipPer + ""), Validators.required]
        }))
      })
      this.getNominee.removeAt(0);
      console.log(this.addrealEstateForm.controls.getNomineeName.value)
    }
      if (data.realEstateOwners != undefined) {
        data.realEstateOwners.forEach(element => {
          this.addrealEstateForm.controls.getCoOwnerName.push(this.fb.group({
            ownerName: [(element.ownerName) + "", [Validators.required]],
            ownershipPerc: [(element.ownershipPerc + ""), Validators.required]
          }))
        })
      }
    // if(data.realEstateOwners!=undefined){
    //   data.realEstateOwners.forEach(element => {
    //     this.addrealEstateForm.controls.getCoOwnerName=this.fb.array([this.fb.group({
    //       ownerName: [(element.ownerName),[Validators.required]],
    //       ownershipPerc: [element.ownershipPerc,Validators.required]})])
    //   })
    // }
    this.ownerData = this.addrealEstateForm.controls;

    }
   saveFormData(){
    this.getValue=this.getDateYMD()
     console.log(this.getValue);
     if (this.addrealEstateForm.controls.type.invalid) {
      this.isTypeValid = true;
      return;
       } else if(this.addrealEstateForm.controls.marketValue.invalid){
        this.isMvValid = true;
       }else{
      const obj = {
        ownerName:this.ownerName,
        // ownerPercent:this.addrealEstateForm.controls.ownerPercent.value,
        // coOwnerPercent:this.addrealEstateForm.controls.coOwnerPercent.value,
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
        nomineeData:[],
        ownerData:[],
        }
        this.addrealEstateForm.value.getNomineeName.forEach(element => {
          if(element){
           let obj1={
            'name': element.name,
            'familyMemberId':this.selectedFamilyData.id,
            'ownershipPer':parseInt(element.ownershipPer)
           }
          obj.nomineeData.push(obj1)
        }
      });
          this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
            if(element){
             let obj1={
              'ownerName': element.ownerName,
              'familyMemberId':this.selectedFamilyData.id,
              'ownershipPerc':parseInt(element.coOwnerPerc)
             }
            obj.ownerData.push(obj1)
            }
        });
        if(this._inputData=='Add'){
          let objToSend={
            "clientId": this.clientId,
              "advisorId": this.advisorId,
              "typeId": obj.type,
              "marketValue": obj.marketValue,
              "purchasePeriod": this.purchasePeriod,
              "purchaseValue": obj.purchaseValue,
              "unitId": obj.unit,
              "ratePerUnit": obj.ratePerUnit,
              "stampDutyCharge": obj.stampDuty,
              "registrationCharge": obj.registration,
              "gstCharge": obj.gst,
              "location": obj.location,
              "description": obj.description,
              "realEstateOwners": obj.ownerData,
              "realEstateNominees":obj.nomineeData,      
              }
          console.log(obj);
          this.custumService.addRealEstate(objToSend).subscribe(
            data => this.addRealEstateRes(data)
          );
        }else{
          let objToSend={
              "id":this._inputData.id,
              "clientId": this.clientId,
              "advisorId":  this.advisorId,
              "typeId": obj.type,
              "marketValue":  obj.marketValue,
              "purchasePeriod": this.purchasePeriod,
              "purchaseValue": obj.purchaseValue,
              "unitId":  obj.unit,
              "ratePerUnit": obj.ratePerUnit,
              "stampDutyCharge": obj.stampDuty,
              "registrationCharge": obj.registration,
              "gstCharge": obj.gst,
              "location":  obj.location,
              "description": obj.description,
              "realEstateOwners": obj.ownerData,
              "realEstateNominees":obj.nomineeData,      
              }
          console.log(obj);
          this.custumService.editRealEstate(objToSend).subscribe(
            data => this.editRealEstateRes(data)
          );
        }
       }
   }
   addRealEstateRes(data){
     console.log(data);
     if(data){
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close'})
      this.eventService.openSnackBar('Liabilities added successfully', 'OK');   
    }else{
      this.eventService.openSnackBar('Error', 'dismiss');   

    }
   }
   editRealEstateRes(data){
    console.log(data);
    if(data){
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close' })
      this.eventService.openSnackBar('Liabilities edited successfully', 'OK'); 
    }else{
      this.eventService.openSnackBar('Error', 'dismiss');   
    }
   }
  }
