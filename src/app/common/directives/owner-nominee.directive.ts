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
      name: "", ownershipPerc: null, familyMemberId: null
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
        
    // this.sendData.forEach(element => {
    //   for(let e in this.getCoOwner.controls){
    //     const arrayCon:any = this.getCoOwner.controls[e];
    //     if(arrayCon.value.name != ''){
    //       if(element.userName == arrayCon.value.name){
    //         element.disable = true;
    //         return;
    //       }
    //       else{
    //         element.disable = false;
    //       }
    //     }
    //   }
    // });

  }

  get data() {
    return this.ownerData;
  }

  // getOwnerName(value) {
    // console.log('selected', value);
    // value.familyList = this.family;
    // this.valueChange.emit(value);
  // }

  // checkOwnerType(value){
  //   if(value == '2'){
  //   // this.reqError = false;
  //     this.ownerData.controls['ownerName'].setValidators(Validators.required);
  //     this.ownerData.get('ownerName').updateValueAndValidity();
  //     for (let element in this.ownerData.controls) {
  //       console.log(element)
  //       if(element == 'getCoOwnerName'){
  //         for(let e in this.getCoOwner.controls){
  //           // this.getCoOwner.removeAt(parseInt(e));
  //           const arrayCon:any = this.getCoOwner.controls[e];
  //           for(let i in arrayCon.controls){
  //             if(i== "name"){
  //             arrayCon.get(i).setValue('');
  //             // arrayCon.get(i).setErrors({required:false});
  //             }
  //             arrayCon.get(i).setValidators([]);
  //             arrayCon.get(i).updateValueAndValidity();
  //           }
  //         }
  //       }
  //     }
  //   }
  //   else{
  //     if(this.ownerData.value.getCoOwnerName.length < 2){
  //       for(let i = 0; i < 1 ; i++){
  //         this.addNewCoOwner(true);
  //       }
  //     }
  //     // this.disabledMember();
  //     this.ownerData.controls['ownerName'].setValidators([]);
  //     this.ownerData.get('ownerName').updateValueAndValidity();
  //     for (let element in this.ownerData.controls) {
  //       console.log(element)
  //       if(element == 'getCoOwnerName'){
  //         for(let e in this.getCoOwner.controls){
  //           const arrayCon:any = this.getCoOwner.controls[e];
  //           for(let i in arrayCon.controls){
  //             if(i != 'familyMemberId'){
  //               arrayCon.controls[i].setValidators(Validators.required);
  //               arrayCon.get(i).updateValueAndValidity();
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   this.setOwnerNominee();
  //   this.valueChange.emit(this.ownerNomineeJson);
  // }
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
            
            if(e == "1"){
              if (this.ownerPer > 100 || this.ownerPer < 100) {
                this.showErrorOwner = true;
                  arrayCon.get('ownershipPerc').setErrors({'incorrect': true});
                  // arrayCon.get('ownershipPerc').updateValueAndValidity();
                  console.log('show error Percent cannot be more than 100%', arrayCon)
                }
                else {
                  this.showErrorOwner = false
                  // this.showErrorCoOwner = false;
                  arrayCon.controls['ownershipPerc'].setErrors({'incorrect': false});
                  arrayCon.get('ownershipPerc').updateValueAndValidity();
                }
              } 
              this.getCoOwner.controls[e] = arrayCon;
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
