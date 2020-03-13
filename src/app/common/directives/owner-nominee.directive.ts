import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Directive({
  selector: '[appOwnerNominee]'
})
export class OwnerNomineeDirective {
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any = [];
  ownerNomineeJson:any;
  @Input()set data(data) {
    this.ownerData = data.controleData;
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    if(data.Fmember.length <= 0){
    this.getListFamilyMem();
    }
  }

  @Input()set callMethod(callMethod:any){
    if(callMethod){
      switch (callMethod.methodName) {
        case "checkOwnerType":
          // this.checkOwnerType(callMethod.ParamValue);
        break;
  
        case "onChangeJointOwnership":
          this.onChangeJointOwnership(callMethod.ParamValue);
        break;
  
        case "disabledMember":
          this.disabledMember(callMethod.type);
        break;
  
        default:
          break;
      }
    }
  }

  @Output() valueChange3 = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();
  constructor(private fb: FormBuilder, private custumService: CustomerService) { }

  getListFamilyMem():any {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    if(this.sendData.length <= 0){
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
    }
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    if (data.familyMembersList && data.familyMembersList.length > 0) {
      data.familyMembersList.forEach((singleData) => {
        setTimeout(() => {
          singleData['disable'] = false;
        }, 100);
      });
    }
    this.sendData = data.familyMembersList;
    this.valueChange1.emit(this.sendData);
    console.log(this.sendData,"sendData 123");
  }

  get getCoOwner() {
    return this.ownerData.get('getCoOwnerName') as FormArray;
  }

  get getNominee() {
    return this.ownerData.get('getNomineeName') as FormArray;
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: "", share: null, familyMemberId: null
    }));
  }

  disabledMember(value){
    let controlsArr:any = [];
    if(this.getCoOwner){
      for(let e in this.getCoOwner.controls){
        controlsArr.push({type:'owner', index:e, data:this.getCoOwner.controls[e].value});
      }
    }

    if(this.getNominee){
      for(let e in this.getNominee.controls){
        controlsArr.push({type:'nominee', index:e, data:this.getNominee.controls[e].value});
      }
    }

    console.log(controlsArr, "controlsArr 123");
    
    this.sendData.forEach(element => {
      for(let e of controlsArr){
        if(e.data.name != ''){
          if(element.userName == e.data.name){
              if(e.type == 'owner'){
                  this.getCoOwner.controls[e.index].get('familyMemberId').setValue(element.id)
              }
              else{
                this.getNominee.controls[e.index].get('familyMemberId').setValue(element.id)
              }
              element.disable = true;
              return;
            }
            else{
              element.disable = false;
            }
          }
        }
      });
      if(this.getNominee != null){
        if(this.getNominee.value.length == 1 && this.getNominee.value[0].name != ''){
            this.getNominee.controls['0'].get('sharePercentage').setValue('100');
            this.setOwnerNominee();
            this.valueChange3.emit(this.ownerNomineeJson);
          }
      }

  }

  get data() {
    return this.ownerData;
  }

  
  showError:boolean = false;
  ownerPer:any;
  NomineePer:any;
  showErrorOwner:boolean =false;
  onChangeJointOwnership(data) {
    if (data == 'owner') {
      this.ownerPer = 0;
      
      for(let e in this.getCoOwner.controls){
        const arrayCon:any = this.getCoOwner.controls[e];
        
            this.ownerPer += arrayCon.value.share;
            
            if(e == "1"){
              if (this.ownerPer > 100 || this.ownerPer < 100) {
                this.showErrorOwner = true;
                  arrayCon.get('share').setErrors({'incorrect': true});
                  // arrayCon.get('share').updateValueAndValidity();
                  console.log('show error Percent cannot be more than 100%', arrayCon)
                }
                else {
                  this.showErrorOwner = false
                  // this.showErrorCoOwner = false;
                  arrayCon.controls['share'].setErrors({'incorrect': false});
                  arrayCon.get('share').updateValueAndValidity();
                }
              } 
              this.getCoOwner.controls[e] = arrayCon;
      }
     
     
    } else {
      this.NomineePer = 0;

      for(let e in this.getNominee.controls){
        const arrayCon:any = this.getNominee.controls[e];
        
            this.NomineePer += arrayCon.value.sharePercentage;
          
              if (this.NomineePer > 100 || this.NomineePer < 100) {
                this.showErrorOwner = true;
                if(e == "1"){
                  arrayCon.controls['sharePercentage'].setErrors({'incorrect': true});
                  // arrayCon.get('sharePercentage').updateValueAndValidity();
                }
                console.log('show error Percent cannot be more than 100%')
              } else {
                this.showErrorOwner = false
                // this.showErrorCoOwner = false;
                arrayCon.controls['sharePercentage'].setErrors({'incorrect': false});
                arrayCon.get('sharePercentage').updateValueAndValidity();
              }
            
      }
    }
    this.setOwnerNominee();
    this.valueChange3.emit(this.ownerNomineeJson);
  }

  setOwnerNominee(){
    console.log(this.getCoOwner);
    
    this.ownerNomineeJson = {
      owner: this.getCoOwner,
      nominee: this.getNominee
    }
  }
}
