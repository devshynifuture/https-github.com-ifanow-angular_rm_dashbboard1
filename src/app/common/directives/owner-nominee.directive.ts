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
  sendData: any;
  ownerNomineeJson:any;
  @Input()set data(data) {
    this.ownerData = data;
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    this.getListFamilyMem();
  }

  @Input()set callMethod(callMethod:any){
    switch (callMethod.methodName) {
      case "checkOwnerType":
        this.checkOwnerType(callMethod.ParamValue);
      break;

      case "onChangeJointOwnership":
        this.onChangeJointOwnership(callMethod.ParamValue);
      break;

      case "disabledMember":
        this.disabledMember(callMethod.ParamValue);
      break;

      default:
        break;
    }
  }

  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();
  constructor(private fb: FormBuilder, private custumService: CustomerService) { }

  getListFamilyMem():any {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    if (data.familyMembersList && data.familyMembersList.length > 0) {
      data.familyMembersList.forEach((singleData) => {
        singleData['disable'] = false;
      });
    }
    this.sendData = data.familyMembersList;
    this.valueChange1.emit(this.sendData);
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
      ownerName: "", ownershipPerc: null, familyMemberId: null
    }));
  }

  disabledMember(value){
    this.sendData.forEach(element => {
      for(let e in this.getCoOwner.controls){
        const arrayCon:any = this.getCoOwner.controls[e];
        if(arrayCon.value.ownerName != ''){
          if(element.userName == arrayCon.value.ownerName){
            element.disable = true;
            return;
          }
          else{
            element.disable = false;
          }
        }
      }
    });
  }

  get data() {
    return this.ownerData;
  }

  getOwnerName(value) {
    // console.log('selected', value);
    // value.familyList = this.family;
    this.valueChange.emit(value);
  }

  checkOwnerType(value){
    if(value == '2'){
    // this.reqError = false;
      this.ownerData.controls['ownerName'].setValidators(Validators.required);
      this.ownerData.get('ownerName').updateValueAndValidity();
      for (let element in this.ownerData.controls) {
        console.log(element)
        if(element == 'getCoOwnerName'){
          for(let e in this.getCoOwner.controls){
            // this.getCoOwner.removeAt(parseInt(e));
            const arrayCon:any = this.getCoOwner.controls[e];
            for(let i in arrayCon.controls){
              if(i== "ownerName"){
              arrayCon.get(i).setValue('');
              // arrayCon.get(i).setErrors({required:false});
              }
              arrayCon.get(i).setValidators([]);
              arrayCon.get(i).updateValueAndValidity();
            }
          }
        }
      }
    }
    else{
      if(this.ownerData.value.getCoOwnerName.length < 2){
        for(let i = 0; i < 1 ; i++){
          this.addNewCoOwner(true);
        }
      }
      // this.disabledMember();
      this.ownerData.controls['ownerName'].setValidators([]);
      this.ownerData.get('ownerName').updateValueAndValidity();
      for (let element in this.ownerData.controls) {
        console.log(element)
        if(element == 'getCoOwnerName'){
          for(let e in this.getCoOwner.controls){
            const arrayCon:any = this.getCoOwner.controls[e];
            for(let i in arrayCon.controls){
              if(i != 'familyMemberId'){
                arrayCon.controls[i].setValidators(Validators.required);
                arrayCon.get(i).updateValueAndValidity();
              }
            }
          }
        }
      }
    }
    this.valueChange.emit(this.ownerNomineeJson);
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
        
            this.ownerPer += arrayCon.value.ownershipPerc;
          
              if (this.ownerPer > 100 || this.ownerPer < 100) {
                this.showErrorOwner = true;
                if(e == "1"){
                  arrayCon.controls['ownershipPerc'].setErrors({'incorrect': true});
                  arrayCon.get('ownershipPerc').updateValueAndValidity();
                }
                console.log('show error Percent cannot be more than 100%')
              } else {
                this.showErrorOwner = false
                // this.showErrorCoOwner = false;
                arrayCon.controls['ownershipPerc'].setErrors({'incorrect': false});
                arrayCon.get('ownershipPerc').updateValueAndValidity();
              }
            
      }
      // this.getCoOwner.value.forEach(element => {
      //   this.ownerPer += (element.ownershipPerc) ? parseInt(element.ownershipPerc) : null;
      // });
      // this.ownerPer = this.fixedDeposit.controls.ownerPercent.value + this.ownerPer
     
    } else {
      this.NomineePer = 0;

      for(let e in this.getCoOwner.controls){
        const arrayCon:any = this.getNominee.controls[e];
        
            this.NomineePer += arrayCon.value.sharePercentage;
          
              if (this.NomineePer > 100 || this.NomineePer < 100) {
                this.showErrorOwner = true;
                if(e == "1"){
                  arrayCon.controls['sharePercentage'].setErrors({'incorrect': true});
                  arrayCon.get('sharePercentage').updateValueAndValidity();
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
    this.valueChange.emit(this.ownerNomineeJson);
  }

  setOwnerNominee(){
    this.ownerNomineeJson = {
      owner: this.ownerData.controls['getCoOwnerName'],
      nominee: this.ownerData.controls['getCoOwnerName']
    }
  }
}
