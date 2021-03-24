import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { Observable } from 'rxjs';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';

import { map, startWith } from 'rxjs/operators';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { AssetValidationService } from '../../../asset-validation.service';
import { CustomerOverviewService } from '../../../../../customer-overview/customer-overview.service';
@Component({
  selector: 'app-nps-scheme-holding',
  templateUrl: './nps-scheme-holding.component.html',
  styleUrls: ['./nps-scheme-holding.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],

})
export class NpsSchemeHoldingComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  @ViewChild('unit', { static: false }) unit;

  validatorType = ValidatorType
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  schemeHoldingsNPS: any;
  isPran = false
  advisorId: any;
  ownerData: any;
  schemes: any[];
  schemeList: any;
  idForscheme: any;
  idForscheme1: any[];
  clientId: any;
  maxDate = new Date();
  nomineesListFM: any = [];
  callMethod: any;
  dataFM = [];
  familyList: any;
  nexNomineePer = 0;
  showError = false;
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(private event: EventService, public dialog: MatDialog, private enumService: EnumServiceService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService,
    private assetValidation: AssetValidationService,
    private customerOverview: CustomerOverviewService) {

  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Scheme level holding';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.idForscheme1 = []
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();


    //link bank
    this.bankList = this.enumService.getBank();
    //link bank
  }

  private _filter(name: any): any[] {
    const filterValue = name.toLowerCase();

    return this.schemeList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }




  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      // var evens = _.reject(this.dataFM, function (n) {
      //   return n.userName == name;
      // });
      let evens = this.dataFM.filter(deltData => deltData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  onNomineeChange(value) {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.nomineePercentageShare;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getGlobalList() {
    this.custumService.getSchemeChoice().subscribe(
      data => this.getGlobalRes(data)
    );
  }
  schemeListData: any = [];
  getGlobalRes(data) {

    console.log('getGlobalRes', data)
    this.schemeListData = data.npsSchemeList;
    this.schemeList = this.schemeListData;
    this.startFilter();
  }

  filterSchemeOptions(name) {
    if (name.length >= 3) {
      let obj = {
        name: name
      }
      this.custumService.getFilterSchemeChoice(obj).subscribe(
        data => {
          this.schemeList = data;
        });
    }
    else {
      this.schemeList = this.schemeListData;
    }
  }

  startFilter() {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.schemeList.slice())
    );
  }

  getdataForm(data) {
    this.getGlobalList();
    this.flag = data;
    if (data == undefined) {
      data = {}
    }
    this.schemeHoldingsNPS = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      maturityDate: [data ? new Date(data.maturityDate) : null],
      schemeChoice: [(data == undefined) ? '' : data.schemeChoice, [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran],
      // schemeName: [(data == undefined) ? '' : data.schemeName, [Validators.required]],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],
      holdingList: this.fb.array([this.fb.group({
        schemeId: ['', [Validators.required]], schemeName: [], holdingAsOn: [null, [Validators.required]],
        totalUnits: [null, [Validators.required]], totalAmountInvested: []
      })]),
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: [null, [Validators.required]],
        accountPreferenceId: [null], approxContribution: [null, [Validators.required]]
      })]),
      bankACNo: [(!data) ? '' : data.userBankMappingId],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })])
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.schemeHoldingsNPS.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    if (data.ownerList && data.ownerList.length > 0) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
    }

    /***owner***/

    /***nominee***/
    if (data.nomineeList) {
      if (data.nomineeList.length > 0) {

        this.getNominee.removeAt(0);
        data.nomineeList.forEach(element => {
          this.addNewNominee(element);
        });
      }
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.schemeHoldingsNPS }
    // ==============owner-nominee Data ========================\\ 
    // this.familyMemberId = this.schemeHoldingsNPS.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]
    if (data.futureContributionList != undefined || data.nominees != undefined || data.holdingList != undefined) {
      data.futureContributionList.forEach(element => {
        this.schemeHoldingsNPS.controls.futureContributionList.push(this.fb.group({
          frequencyId: [(element.frequencyId) + "", [Validators.required]],
          accountPreferenceId: [(element.accountPreferenceId + "")],
          approxContribution: [(element.approxContribution), Validators.required],
          id: [element.id, [Validators.required]]
        }))
      })
      // data.nominees.forEach(element => {
      //   this.schemeHoldingsNPS.controls.nominees.push(this.fb.group({
      //     name: [(element.name), [Validators.required]],
      //     sharePercentage: [element.sharePercentage , Validators.required],
      //     id:[element.id,[Validators.required]],
      //     familyMemberId:[element.familyMemberId]
      //   }))
      // })
      // if (data.nominees != undefined) {
      //   if (data.nominees.length != 0) {
      //     data.nominees.forEach(element => {
      //       this.schemeHoldingsNPS.controls.nominees.push(this.fb.group({
      //         name: [(element.name), [Validators.required]],
      //         familyMemberId: [(element.familyMemberId), [Validators.required]],
      //         sharePercentage: [element.sharePercentage, Validators.required],
      //         id: [element.id, [Validators.required]]
      //       }))
      //     })
      //     this.nominee.removeAt(0);

      //   } else {
      //     this.nominee.push(this.fb.group({
      //       name: [null, [Validators.required]], sharePercentage: [null, [Validators.required]],
      //     }));
      //   }

      // }
      data.holdingList.forEach(element => {
        this.schemeHoldingsNPS.controls.holdingList.push(this.fb.group({
          schemeId: [element.schemeId, [Validators.required]],
          totalUnits: [element.totalUnits, Validators.required],
          schemeName: [element.schemeName],
          totalAmountInvested: [element.totalAmountInvested],
          holdingAsOn: [new Date(element.holdingAsOn), Validators.required],
          id: [element.id, [Validators.required]]
        }))

      })
      // this.schemeList
      // this.nominee.removeAt(0);
      this.futureContry.removeAt(0);
      this.holdings.removeAt(0);
    }

  }
  get holdings() {
    return this.schemeHoldingsNPS.get('holdingList') as FormArray;
  }

  setGroupValue(scheme) {
    if (scheme != null) {
      this.schemeHoldingsNPS.controls.holdingList.controls[scheme.index].controls['schemeId'].setValue(scheme.scheme.id)
    }
  }



  displayScheme(scheme) {
    // const controls = this.schemeHoldingsNPS.controls.holdingList;
    // this.setGroupValue(scheme);
    return scheme ? scheme.scheme.name : undefined;
  }
  addHoldings() {
    this.holdings.push(this.fb.group({
      schemeId: [null, [Validators.required]], schemeName: [null], holdingAsOn: [null, [Validators.required]],
      totalUnits: [null, [Validators.required]], totalAmountInvested: []
    }));

  }
  removeHoldings(item) {
    if (this.holdings.value.length > 1) {
      this.holdings.removeAt(item)
    }
  }
  get futureContry() {
    return this.schemeHoldingsNPS.get('futureContributionList') as FormArray;
  }
  addFutureContry() {
    this.futureContry.push(this.fb.group({
      frequencyId: [null, [Validators.required]],
      accountPreferenceId: [null], approxContribution: [null, [Validators.required]]
    }));

  }
  removeFutureContry() {
    if (this.futureContry.value.length > 1) {
      // this.futureContry.removeAt(item);
    }
  }
  get nominee() {
    return this.schemeHoldingsNPS.get('nominees') as FormArray;
  }
  addNominee() {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.sharePercentage;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
    if (this.showError == false) {
      this.nominee.push(this.fb.group({
        name: null, sharePercentage: null,
      }));
    }

  }
  removeNominee(item) {
    if (this.nominee.value.length > 1) {
      this.nominee.removeAt(item);
    }
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.nomineePercentageShare;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getFormControl(): any {
    return this.schemeHoldingsNPS.controls;
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }

  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  selectOwner: any;
  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
    setTimeout(() => {
      this.selectOwner = this.nomineesListFM.filter((m) => m.familyMemberId == this.schemeHoldingsNPS.value.getCoOwnerName[0].familyMemberId || (m.clientId == this.schemeHoldingsNPS.value.getCoOwnerName[0].familyMemberId && this.schemeHoldingsNPS.value.getCoOwnerName[0].isClient == 1))
    }, 1000);
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.schemeHoldingsNPS.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.schemeHoldingsNPS.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get getCoOwner() {
    return this.schemeHoldingsNPS.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.schemeHoldingsNPS.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.schemeHoldingsNPS.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.schemeHoldingsNPS.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
  /***nominee***/
  // ===================owner-nominee directive=====================//

  saveSchemeHolding() {
    console.log(this.schemeHoldingsNPS.get('holdingList').invalid)
    console.log(this.schemeHoldingsNPS.get('futureContributionList').invalid)
    // console.log(this.schemeHoldingsNPS.get('nominees').invalid)
    if (this.schemeHoldingsNPS.invalid) {
      // this.schemeHoldingsNPS.get('ownerName').markAsTouched();
      this.schemeHoldingsNPS.markAllAsTouched();
      // this.schemeHoldingsNPS.get('ownerName').markAsTouched();
      // this.schemeHoldingsNPS.get('holdingList').markAsTouched();
      // this.schemeHoldingsNPS.get('futureContributionList').markAsTouched();
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.schemeHoldingsNPS.controls.ownerName.value : this.ownerName,
        ownerList: this.schemeHoldingsNPS.value.getCoOwnerName,
        pran: this.schemeHoldingsNPS.controls.pran.value,
        schemeChoice: this.schemeHoldingsNPS.controls.schemeChoice.value,
        holdingList: this.schemeHoldingsNPS.controls.holdingList.value,
        futureContributionList: this.schemeHoldingsNPS.controls.futureContributionList.value,
        // nominees: this.schemeHoldingsNPS.controls.nominees.value,
        maturityDate: this.schemeHoldingsNPS.value.maturityDate ? this.datePipe.transform(this.schemeHoldingsNPS.value.maturityDate, 'dd/MM/yyyy') : null,
        nomineeList: this.schemeHoldingsNPS.value.getNomineeName,
        familyMemberDob: this.datePipe.transform(this.selectOwner[0].dateOfBirth, 'dd/MM/yyyy'),
        description: this.schemeHoldingsNPS.controls.description.value == null ? '' : this.schemeHoldingsNPS.controls.description.value,
        id: this.schemeHoldingsNPS.controls.id.value,
        userBankMappingId: this.schemeHoldingsNPS.controls.bankACNo.value,

        // currentValuation: 0,
        // realOrFictitious: 1,
        // totalAmountInvested: 0
      }
      this.barButtonOptions.active = true;
      obj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList = this.schemeHoldingsNPS.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.schemeHoldingsNPS.controls.id.value == undefined && this.flag != 'adviceNPSSchemeHolding') {
        this.custumService.addNPS(obj).subscribe(
          data => this.addNPSRes(data),
          err => {
            this.barButtonOptions.active = false;
          }
        );
      } else if (this.flag == 'adviceNPSSchemeHolding') {
        this.custumService.getAdviceNps(adviceObj).subscribe(
          data => this.getAdviceNscSchemeLevelRes(data),
          err => {
            this.barButtonOptions.active = false;
          }
        );
      } else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data => this.editNPSRes(data),
          err => {
            this.barButtonOptions.active = false;
          }
        );
      }
    }
  }
  getAdviceNscSchemeLevelRes(data) {
    this.customerOverview.portFolioData = null;
    this.customerOverview.assetAllocationChart = null;
    this.customerOverview.summaryLeftsidebarData = null;
    this.customerOverview.aumGraphdata = null;
    this.customerOverview.assetAllocationChart = null;
    this.customerOverview.summaryCashFlowData = null;
    this.barButtonOptions.active = false;
    this.event.openSnackBar('NPS added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  addNPSRes(data) {
    this.customerOverview.portFolioData = null;
    this.customerOverview.assetAllocationChart = null;
    this.customerOverview.summaryLeftsidebarData = null;
    this.customerOverview.aumGraphdata = null;
    this.customerOverview.assetAllocationChart = null;
    this.customerOverview.summaryCashFlowData = null;
    this.assetValidation.addAssetCount({ type: 'Add', value: 'retirementAccounts' })
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  editNPSRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  bankList: any = [];

  getBank() {
    if (this.enumService.getBank().length > 0) {
      this.bankList = this.enumService.getBank();
    }
    else {
      this.bankList = [];
    }
    console.log(this.bankList, "this.bankList2");
  }
  //link bank
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    })

  }
  //link bank

  schemeDialog(holding): void {
    const dialogRef = this.dialog.open(SchemeListComponent, {
      width: '700px',
      height: '500px',
      data: this.schemeListData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        holding.get('schemeName').setValue(result.name);
        holding.get('schemeId').setValue(result.id);
        this.unit.nativeElement.focus();
      }
    });

  }
}
