import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormArray, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Directive({
  selector: '[appOwnerNominee]'
})
export class OwnerNomineeDirective {

  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any = [];
  ownerNomineeJson: any;
  showError = false;
  ownerPer: any;
  NomineePer: any;
  showErrorOwner = false;
  emitedNOminee: any = [];

  constructor(private fb: FormBuilder, private enumDataService: EnumDataService, private custumService: CustomerService, private enumService: EnumServiceService,
    private peopleService: PeopleService) {
  }

  @Input() set callMethod(callMethod: any) {
    if (callMethod) {
      switch (callMethod.methodName) {
        case 'checkOwnerType':
          // this.checkOwnerType(callMethod.ParamValue);
          break;

        case 'onChangeJointOwnership':
          this.onChangeJointOwnership(callMethod.ParamValue);
          break;

        case 'disabledMember':
          this.callGetBank = true;
          this.disabledMember(callMethod.type);
          break;

        default:
          break;
      }
    }
  }

  _requestData;
  @Input() set requestData(data) {
    this._requestData = data;
  };

  get() {
    return this._requestData;
  }

  @Input() userTypeFlag;
  @Output() valueChange3 = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();
  @Output() emitBank = new EventEmitter();

  get getCoOwner() {
    if (this.ownerData) {
      return this.ownerData.get('getCoOwnerName') as FormArray;
    }
  }

  get getNominee() {
    if (this.ownerData) {
      return this.ownerData.get('getNomineeName') as FormArray;
    }
  }

  get data() {
    return this.ownerData;
  }

  @Input() set data(data) {
    if (data) {
      this.ownerData = data.controleData;
      this.emitedNOminee = data.Fmember;
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId();
      if ((this.clientId || this.requestData) && data.Fmember.length <= 0) {
        this.getListFamilyMem();
      }
    }
  }


  getListFamilyMem(): any {

    let obj = {
      clientId: this.clientId,
    };
    if (this._requestData) {
      obj = this._requestData;
    }
    if (this.sendData.length <= 0) {
      this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
        (data) => {
          this.enumService.getFamilyList(data);
          this.getListOfFamilyByClientRes(data);
        },
        error => {
          this.getListOfFamilyByClientRes(this.enumService.FamilyList());
        }
      );
    }
  }

  getListOfFamilyByClientRes(data) {
    data.forEach((singleData) => {
      singleData['userName'] = singleData.displayName;
      setTimeout(() => {
        singleData.disable = false;
      }, 100);
    });
    this.sendData = data;
    console.log(this.sendData, 'familyList');
    this.disabledMember(null);
    this.valueChange1.emit(this.sendData);
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: '', share: null, familyMemberId: null
    }));
  }

  userForBank: any;
  callGetBank: boolean = true;
  disabledMember(value) {

    this.userForBank = [];
    const controlsArr: any = [];
    if (this.getCoOwner) {
      for (const e in this.getCoOwner.controls) {
        controlsArr.push({ type: 'owner', index: e, data: this.getCoOwner.controls[e].value });
      }
    }

    if (this.getNominee) {
      for (const e in this.getNominee.controls) {
        controlsArr.push({ type: 'nominee', index: e, data: this.getNominee.controls[e].value });
      }
    }

    if (this.sendData.length <= 0) {
      this.sendData = this.emitedNOminee;
    }
    this.sendData.forEach((element, f) => {

      for (const [i, e] of controlsArr.entries()) {
        if (e.data.name != '') {
          if (element.userName == e.data.name) {
            if (e.type == 'owner') {
              // if(e.index == "0"){
              setTimeout(() => {
                let owners = this.sendData.filter(x => x.id == this.getCoOwner.controls[e.index].get('familyMemberId').value || (x.clientId == this.getCoOwner.controls[e.index].get('familyMemberId').value && x.relationshipId == 1));
                this.userForBank.push(owners[0]);
                console.log(this.userForBank);
                // && controlsArr.length - 1 == i

              }, 500);
              // }
              this.getCoOwner.controls[e.index].get('familyMemberId').setValue(element.id == 0 ? element.clientId : element.familyMemberId);
              this.getCoOwner.controls[e.index].get('isClient').setValue(element.relationshipId == 1 ? 1 : 0);
              if (this.getCoOwner.controls[e.index].get('relationshipId')) {
                this.getCoOwner.controls[e.index].get('relationshipId').setValue(element.relationshipId);
              }
            } else {
              this.getNominee.controls[e.index].get('familyMemberId').setValue(element.id == 0 ? element.clientId : element.familyMemberId);
              if (this.getNominee.controls[e.index].get('relationshipId')) {
                this.getNominee.controls[e.index].get('relationshipId').setValue(element.relationshipId);
              }
            }
            element.disable = true;
            if (this.sendData.length > 1) {
              return;
            }
          } else {
            element.disable = false;
          }
        }
        setTimeout(() => {
          if (this.userForBank.length > 0 && this.callGetBank) {
            this.callGetBank = false;
            this.enumDataService.getAccountList(this.userForBank).then((data) => {
              this.emitBank.emit();
            });
          }
        }, 600);
      }
    });
    if (this.getNominee != null) {
      if (this.getNominee.value.length == 1 && this.getNominee.value[0].name != '') {
        this.getNominee.controls['0'].get('sharePercentage').setValue('100');
        this.setOwnerNominee();
        this.valueChange3.emit(this.ownerNomineeJson);
        // this.valueChange1.emit(this.sendData);

      }
    }

  }

  onChangeJointOwnership(data) {
    if (data == 'owner') {
      this.ownerPer = 0;

      for (const e in this.getCoOwner.controls) {
        const arrayCon: any = this.getCoOwner.controls[e];

        this.ownerPer += arrayCon.value.share;

        if (parseInt(e) == this.ownerData.value.getCoOwnerName.length - 1) {
          if (this.ownerPer > 100 || this.ownerPer < 100) {
            this.showErrorOwner = true;
            arrayCon.get('share').setErrors({ incorrect: true });
            arrayCon.get('share').markAsTouched();
            // arrayCon.get('share').updateValueAndValidity();
          } else {
            this.showErrorOwner = false;
            // this.showErrorCoOwner = false;
            arrayCon.controls.share.setErrors({ incorrect: false });
            arrayCon.get('share').updateValueAndValidity();
          }
        }
        this.getCoOwner.controls[e] = arrayCon;
      }


    } else {
      this.NomineePer = 0;

      for (const e in this.getNominee.controls) {
        const arrayCon: any = this.getNominee.controls[e];

        this.NomineePer += arrayCon.value.sharePercentage;

        if (this.NomineePer > 100 || this.NomineePer < 100) {
          this.showErrorOwner = true;
          if (parseInt(e) == this.ownerData.value.getNomineeName.length - 1) {
            arrayCon.controls.sharePercentage.setErrors({ incorrect: true });
            arrayCon.get('sharePercentage').markAsTouched();
            // arrayCon.get('sharePercentage').updateValueAndValidity();
          }
        } else {
          this.showErrorOwner = false;
          // this.showErrorCoOwner = false;
          arrayCon.controls.sharePercentage.setErrors({ incorrect: false });
          arrayCon.get('sharePercentage').updateValueAndValidity();
        }

      }
    }
    this.setOwnerNominee();
    this.valueChange3.emit(this.ownerNomineeJson);
  }

  setOwnerNominee() {

    this.ownerNomineeJson = {
      owner: this.getCoOwner,
      nominee: this.getNominee
    };
  }
}
