import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EnumServiceService } from 'src/app/services/enum-service.service';


@Directive({
  selector: '[appHolderName]'
})

export class HolderNameDirective {
  _requestData: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, private peopleService: PeopleService, private enumService: EnumServiceService) {
  }
  advisorId: any;
  ownerData: any;
  clientId: any;
  sendData: any = [];
  ownerNomineeJson: any;
  showError = false;
  ownerPer: any;
  NomineePer: any;
  showErrorOwner = false;

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
          this.disabledMember(callMethod.type);
          break;

        default:
          break;
      }
    }
  }

  @Input() clientIdData;
  @Input() userTypeFlag;
  @Output() valueChange3 = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

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
    this.ownerData = data.controleData;
    this.advisorId = AuthService.getAdvisorId();
    // this.clientId = AuthService.getClientId();
    if ((this.clientIdData.clientId) && data.Fmember.length == 0) {
      this.getListFamilyMem();
    }
  }
  getListFamilyMem(): any {
    let obj = {
      clientId: this.clientIdData.clientId,
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
    if (data) {
      data.forEach((singleData) => {
        singleData['userName'] = singleData.displayName;
        setTimeout(() => {
          singleData.disable = false;
        }, 100);
      });
      this.sendData = data;
      this.disabledMember(null);
    }
    else {
      this.sendData = [];
    }
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

  disabledMember(value) {
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


    this.sendData.forEach(element => {
      for (const e of controlsArr) {
        if (e.data.name != '') {
          if (element.userName == e.data.name) {
            if (e.type == 'owner') {
              this.getCoOwner.controls[e.index].get('familyMemberId').setValue(element.familyMemberId);
              this.getCoOwner.controls[e.index].get('clientId').setValue(element.clientId);
            } else {
              this.getNominee.controls[e.index].get('familyMemberId').setValue(element.familyMemberId);
            }
            element.disable = true;
            return;
          } else {
            element.disable = false;
          }
        }
      }
    });
    if (this.getNominee != null) {
      if (this.getNominee.value.length == 1 && this.getNominee.value[0].name != '') {
        this.getNominee.controls['0'].get('sharePercentage').setValue('100');
        this.setOwnerNominee();
        this.valueChange3.emit(this.ownerNomineeJson);
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

