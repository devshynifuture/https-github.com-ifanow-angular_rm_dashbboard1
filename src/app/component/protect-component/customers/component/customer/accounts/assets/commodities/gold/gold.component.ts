import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-gold',
  templateUrl: './gold.component.html',
  styleUrls: ['./gold.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class GoldComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  gold: any;
  ownerData: any;
  iAppPurValue = false;
  isTotalsGrams = false
  isBalanceAsOn = false
  isNoTolasGramsPur = false
  isPurchaseYear = false
  isFormOfGold = false
  isCarats = false
  showHide = false;
  advisorId: any;
  fdYears: string[];
  clientId: any;
    nomineesListFM: any = [];
  flag: any;
  currentYear: any = new Date().getFullYear();
  adviceFlagShowHeaderFooter: boolean = true;
  editData: any;
  callMethod: { methodName: string; ParamValue: any; };
  nominees: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Gold';
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;


  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceFlagShowHeaderFooter = false;
    } else {
      this.adviceFlagShowHeaderFooter = true;
    }
    console.log('this is flag::::::', this.data)
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
    this.fdYears = [
      '1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
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

  disabledMember(value, type) {
    this.callMethod = {
      methodName : "disabledMember",
      ParamValue : value,
    //  disControl : type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if(con.owner != null && con.owner){
      this.gold.controls.getCoOwnerName = con.owner;
    }
    if(con.nominee != null && con.nominee){
      this.gold.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName : "onChangeJointOwnership",
      ParamValue : data
    }
  }

  /***owner***/ 

  get getCoOwner() {
    return this.gold.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (data) {
      setTimeout(() => {
       this.disabledMember(null,null);
      }, 1300);
    }

    if(this.getCoOwner.value.length > 1 && !data){
     let share = 100/this.getCoOwner.value.length;
     for (let e in this.getCoOwner.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
      }
      else{
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
      }
     }
    }
   
  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.gold.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100/this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if(!Number.isInteger(share) && e == "0"){
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else{
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/ 

  /***nominee***/ 

  get getNominee() {
    return this.gold.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    if (this.gold.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100/this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if(!Number.isInteger(share) && e == "0"){
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else{
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }


  
  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if(this.getNominee.value.length > 1 && !data){
      let share = 100/this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if(!Number.isInteger(share) && e == "0"){
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else{
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
     }
     
    
  }
  /***nominee***/ 
  // ===================owner-nominee directive=====================//

  Close(flag) {

    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag, sagar: false })
  }
  saveInternal(flag) {

    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag, sagar: false })
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "addGOLD";
    }
    else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editData = data;
      this.flag = "editGOLD";
    }
    this.gold = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: ['', [Validators.required]],
        familyMemberId: null
      })]),
      appPurValue: [data.approximatePurchaseValue, [Validators.required]],
      totalsGrams: [(data.gramsOrTola == undefined) ? '' : (data.gramsOrTola) + "", [Validators.required]],
      formOfGold :  [(data.formOfGold == undefined) ? '' : (data.formOfGold) + "", [Validators.required]],
      noTolasGramsPur: [(data.purchasedGramsOrTola == undefined) ? '' : (data.purchasedGramsOrTola), [Validators.required]],
      tenure: [(data.purchaseYear == undefined) ? '' : (data.purchaseYear), [Validators.required, Validators.minLength(4), Validators.min(1900), Validators.max(this.currentYear)]],
      carats: [(data.carat == undefined) ? '' : (data.carat) + "", [Validators.required]],
      // balanceAsOn: [(data.balanceAsOn == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      description: [(data.description == undefined) ? null : data.description],
      bankAcNo: [(data.bankAcNo == undefined) ? '' : data.bankAcNo],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
    });
    // this.ownerData = this.gold.controls;
    // this.familyMemberId = data.familyMemberId
        // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.gold.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    if (data.ownerList) {
      this.getCoOwner.removeAt(0);
      data.ownerList.forEach(element => {
        this.addNewCoOwner(element);
      });
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

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.gold }
    // ==============owner-nominee Data ========================\\

  }
  getFormControl(): any {
    return this.gold.controls;
  }

  // validateYear(){
  //   if(parseInt(this.gold.get('tenure').value) > new Date().getFullYear() && parseInt(this.gold.get('tenure').value) < 1900){

  //   }
  //   console.log(parseInt(this.gold.get('tenure').value), new Date().getFullYear(),"new Date().getFullYear");
  // }
  saveGold() {
    if (this.gold.invalid) {
      this.gold.markAllAsTouched();
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerList: this.gold.value.getCoOwnerName,
        approximatePurchaseValue: this.gold.controls.appPurValue.value,
        gramsOrTola: this.gold.controls.totalsGrams.value,
        // balanceAsOn: this.gold.controls.balanceAsOn.value,
        purchasedGramsOrTola: this.gold.controls.noTolasGramsPur.value,
        totalsGrams: this.gold.controls.totalsGrams.value,
        purchaseYear: this.gold.controls.tenure.value,
        formOfGold:this.gold.controls.formOfGold.value,
        carat: this.gold.controls.carats.value,
        nomineeList:this.gold.value.getNomineeName,
        description: (this.gold.controls.description.value == '') ? null : this.gold.controls.description.value,
      }

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.gold.value.getNomineeName;
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addGOLD") {
        this.custumService.addGold(obj).subscribe(
          data => this.addGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceGOLD') {
        this.custumService.getAdviceGold(adviceObj).subscribe(
          data => this.getAdviceGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        obj['id'] = this.editData.id
        this.custumService.editGold(obj).subscribe(
          data => this.editGoldRes(data), (error) => {
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceGoldRes(data) {
    this.eventService.openSnackBar('Gold added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
  }
  addGoldRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Added successfully!', 'OK');

  }
  editGoldRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGold', state: 'close', data, refreshRequired: true })
    this.eventService.openSnackBar('Updated successfully!', 'OK');

  }

}
