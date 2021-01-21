import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnumDataService } from "../../../../../../../../services/enum-data.service";
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
import { RoleService } from 'src/app/auth-service/role.service';


@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {
  mobileData: any;
  holderList: any;

  mobileNumberFlag = 'Broker phone';

  dematForm: FormGroup;
  userData;
  dematList: any;
  holdingMode: string;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & CLOSE',
    buttonColor: 'accent',
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
  public dialogRef = null;
  private dialogData;
  clientData: any;
  disableBtn = false;
  saveAndNextFlag: any;
  storeTempDematData: any;
  clientName: any;
  nomineesListFM1: any = [];
  callMethod1: { methodName: string; ParamValue: any; disControl: any; };
  bankList: any = [];
  keyInfoCapability: any = {};
  mobileEditedData: any[];

  constructor(private cusService: CustomerService, private fb: FormBuilder, private injector: Injector,
    private subInjectService: SubscriptionInject, private peopleService: PeopleService,
    private eventService: EventService, public dialog: MatDialog,
    public enumDataService: EnumDataService, private enumService: EnumDataService,
    public roleService: RoleService) {
    this.createDematForm(null);

    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null);
    console.log(this.dialogData, 'userData');

  }

  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  @Output() saveNextData = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Input() fieldFlag;
  @Output() tabDisableFlag = new EventEmitter();

  idData;

  @Input() set data(data) {
    this.userData = data;
    this.clientName = data.displayName
    this.storeTempDematData = Object.assign({}, data);
    this.clientData = (AuthService.getClientData()) ? AuthService.getClientData() : AuthService.getUserInfo();
    this.idData = (this.fieldFlag != 'familyMember') ? this.userData.clientId : this.userData.familyMemberId;
  }


  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  callMethod: any;
  nomineesListFM: any = [];
  checkNomineeFlag = true;

  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  lisNominee(value) {
    if (value && value.length == 0) {
      this.checkNomineeFlag = false;
    } else {
      this.ownerData.Fmember = value;
      this.nomineesListFM = Object.assign([], value);
    }
  }

  lisNominee1(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM1 = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod1 = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }

  displayControler(con) {
    console.log('value selected', con);
    if (this.dematForm.value.getCoOwnerName) {
      if (con.owner != null && con.owner) {
        this.dematForm.controls.getCoOwnerName = con.owner;
      }
    }
    if (con.nominee != null && con.nominee) {
      this.dematForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: 'onChangeJointOwnership',
      ParamValue: data
    };
  }

  /***owner***/

  get getCoOwner() {
    if (this.dematForm.value.getCoOwnerName) {
      return this.dematForm.get('getCoOwnerName') as FormArray;
    }
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '']
      , share: [data ? data.share : ''],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      clientId: [data ? data.clientId : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      const share = 100 / this.getCoOwner.value.length;
      for (const e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    if (this.dematForm.value.getCoOwnerName) {
      this.getCoOwner.removeAt(item);
      if (this.dematForm.value.getCoOwnerName.length == 1) {
        this.getCoOwner.controls['0'].get('share').setValue('100');
      } else {
        const share = 100 / this.getCoOwner.value.length;
        for (const e in this.getCoOwner.controls) {
          if (!Number.isInteger(share) && e == '0') {
            this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
          } else {
            this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
          }
        }
      }
      this.disabledMember(null, null);
    }
  }

  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.dematForm.get('getNomineeName') as FormArray;
  }


  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.dematForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }


  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''],
      sharePercentage: [data ? data.sharePercentage : 0],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (const e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }

  /***nominee***/
  // ===================owner-nominee directive=====================//

  createDematForm(data) {
    (data == undefined) ? data = {} : data;
    this.dematForm = this.fb.group({
      modeOfHolding: [(data.modeOfHolding) ? String(data.modeOfHolding) : '1'],
      // holderName: [(data.modeOfHolding == '1') ? (data.holderNameList && data.holderNameList.length > 0) ? data.holderNameList[0].name : '' : ''],
      depositoryPartName: [data.depositoryParticipantName],
      depositoryPartId: [data.depositoryParticipantId],
      dematClientId: [data.dematClientId],
      brekerName: [data.brokerName],
      brokerAddress: [data.brokerAddress],
      linkedBankAccount: [data.userBankMappingId && data.userBankMappingId != 0 ? data.userBankMappingId : '', [Validators.required]],
      powerOfAttName: [data.powerOfAttorneyName],
      powerOfAttMasId: [data.powerOfAttorneyMasterId],
      getNomineeName: this.fb.array([this.fb.group({
        name: [],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      getCoOwnerName: this.fb.array([this.fb.group({
        name: [this.clientName ? this.clientName : ''],
        share: [''],
        familyMemberId: 0,
        id: 0,
        clientId: 0
      })]),
    });


    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.dematForm.value.getCoOwnerName) {

      if (this.dematForm.value.getCoOwnerName.length == 1) {
        this.getCoOwner.controls['0'].get('share').setValue('100');
      }

      if (data.holderNameList) {
        this.getCoOwner.removeAt(0);
        data.holderNameList.forEach(element => {
          this.addNewCoOwner(element);
        });
      }
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.dematForm };
    // ==============owner-nominee Data ========================\\
  }

  selectHolder(data, index) {
    this.getCoOwner.controls[index].get('clientId').setValue(data.clientId)
    this.getCoOwner.controls[index].get('familyMemberId').setValue(data.familyMemberId)
  }

  getDematList(data) {
    let obj;
    if (this.dialogRef) {
      obj = {
        userId: data.familyMemberId,
        userType: data.isClient == 1 ? 2 : 3
      }
    }
    else {
      obj = {
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
      };
    }
    this.cusService.getDematList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.dematList = data[0];
          this.createDematForm(this.dematList);
          this.holdingMode = (this.dematList.modeOfHolding) ? String(this.dematList.modeOfHolding) : '1';
        } else {
          this.holdingMode = '1';
          this.dematList = {};
        }
      }, err => {
        this.holdingMode = '1';
        this.dematList = {};
      }
    );
  }

  ngOnInit() {
    (this.userData.dematData) ? this.dematList = this.userData.dematData : '';
    if (this.userData.dematData == undefined && this.fieldFlag) {
      this.holdingMode = '1';
      this.createDematForm(null);
      this.getDematList(this.userData);
    } else {
      this.holdingMode = (this.userData.dematData) ? String(this.userData.dematData.modeOfHolding) : '1';
      (this.userData.dematData) ? this.dematList = this.userData.dematData : this.dematList = {};
      this.barButtonOptions.text = 'SAVE & CLOSE';
      this.createDematForm(this.userData.dematData);
    }
    this.keyInfoCapability = this.roleService.overviewPermission.subModules.profile.subModule.keyInfo.capabilityList
    if (!this.dialogRef) {
      this.getBankList();
    }
    else {
      this.bankList = this.dialogData.bankList;
      this.userData = this.dialogData.ownerList.value;
      this.userData['headerFlag'] = "Add";
      this.userData['clientId'] = AuthService.getClientId();
      this.getDematList(this.userData);
      this.barButtonOptions.text = 'SAVE';
    }

  }

  getBankList() {
    const obj = [{
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    }];
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        (data == 0) ? data = undefined : '';
        if (data && data.length > 0) {
          this.bankList = data;
        } else {
          this.bankList = [];
        }
      },
      err => {
        this.bankList = [];
      }
      // this.eventService.openSnackBar(err, "Dismiss")
    );
  }

  getHolderList(data) {
    console.log(data);
    this.holderList = data;
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  saveNext(flag) {
    // (this.dematForm.value.modeOfHolding == '1') ? this.dematForm.get('holderName').setValidators([Validators.required]) : this.dematForm.get('holderName').clearValidators();
    // this.dematForm.get('holderName').updateValueAndValidity();
    if (this.dematForm.invalid) {
      this.dematForm.markAllAsTouched();
      return;
    } else if (this.mobileData.invalid) {
      this.mobileData.markAllAsTouched();
    } else {
      let mobileList = [];
      const holderList = [];
      if (!this.dematList.dematId) {
        this.mobileData.value.forEach(element => {
          mobileList.push({
            mobileNo: element.number,
            isdCodeId: element.code,
            defaultFlag: true,
          })
        });
      }
      else {
        this.mobileEditedData = UtilService.checkMobileListUpdation(this.dematList.mobileDataList, this.mobileData)
        if (this.dematList.mobileDataList.length == 0) {
          this.mobileEditedData.forEach(element => {
            mobileList.push({
              userId: this.userData.userId,
              mobileNo: element.number,
              isdCodeId: element.code,
              defaultFlag: true
            })
          });
        } else {
          this.mobileEditedData.forEach((element, index) => {
            (index == 0) ? element['defaultFlag'] = true : element['defaultFlag'] = false;
          });
          mobileList = this.mobileEditedData;
        }
      }
      // if (this.holderList) {
      //   this.holderList.controls.forEach(element => {
      //     holderList.push({
      //       // fMDetailTypeId: 1,
      //       name: element.get('name').value,
      //       id: element.get('id').value,
      //       dematId: (this.userData.dematData) ? this.userData.dematData.dematId : (this.dematList) ? this.dematList.dematId : null
      //     });
      //   });
      // }
      //  else {
      //   holderList.push({
      //     // fMDetailTypeId: 1,
      //     name: this.dematForm.get('holderName').value,
      //     id: (this.userData.dematList && this.userData.dematList.length > 0) ? this.userData.dematList[0].id : null,
      //     dematId: (this.userData.dematData) ? this.userData.dematData.dematId : (this.dematList) ? this.dematList.dematId : null
      //   });
      // }
      for (const element in this.dematForm.controls) {
        console.log(element);
        this.dematForm.controls[element].markAsTouched();
        if (element == 'getCoOwnerName') {
          for (const e in this.getCoOwner.controls) {
            const arrayCon: any = this.getCoOwner.controls[e];
            for (const i in arrayCon.controls) {
              arrayCon.controls[i].markAsTouched();
            }
          }
        }
        // if (this.fixedDeposit.controls[element].invalid) {
        // return;
        // }
      }
      (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = true;
      const obj = {
        depositoryParticipantName: this.dematForm.get('depositoryPartName').value,
        powerOfAttorneyMasterId: this.dematForm.get('depositoryPartId').value,
        holderNameList: this.dematForm.value.getCoOwnerName,
        modeOfHolding: this.dematForm.get('modeOfHolding').value,
        mobileDataList: mobileList,
        dematId: (this.userData.dematData) ? this.userData.dematData.dematId : (this.dematList) ? this.dematList.dematId : null,
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        brokerAddress: this.dematForm.get('brokerAddress').value,
        depositoryParticipantId: this.dematForm.get('depositoryPartId').value,
        powerOfAttorneyName: this.dematForm.get('powerOfAttName').value,
        nomineeList: this.dematForm.value.getNomineeName,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
        brokerName: this.dematForm.get('brekerName').value,
        dematClientId: this.dematForm.get('dematClientId').value,
        userBankMappingId: this.dematForm.get('linkedBankAccount').value
      };
      if (this.dialogRef) {
        obj.userType = this.userData.isClient == 1 ? 2 : 3;
      }
      this.peopleService.addEditClientDemat(obj).subscribe(
        data => {
          if (this.dialogRef) {
            this.enumDataService.getDematList(this.enumDataService.userData);
            this.dialogRef.close(data);
          }
          console.log(data);
          this.disableBtn = false;
          this.barButtonOptions.active = false;
          this.tabDisableFlag.emit(false);
          if (flag == 'Next') {
            this.tabChange.emit(1);
            this.saveNextData.emit(true);
          } else {
            if (!this.dialogRef) {
              this.closeAndSave();
            }
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
          this.disableBtn = false;
        }
      );

    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.peopleService.deleteDemat(this.userData.dematData.dematId).subscribe(
          data => {
            dialogRef.close();
            this.closeAndSave();
          },
          err => {
            this.eventService.openSnackBar(err, "Dismiss")
          }
        )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  close(data) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    else {
      (this.fieldFlag) ? this.cancelTab.emit('close') : (data == 'close' && this.fieldFlag == undefined) ? this.subInjectService.changeNewRightSliderState({ state: 'close' }) :
        this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
    }
  }

  closeAndSave() {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    });

  }

}
