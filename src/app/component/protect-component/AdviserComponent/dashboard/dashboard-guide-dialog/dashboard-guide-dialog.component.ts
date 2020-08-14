import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../../../customers/component/common-component/document-new-folder/document-new-folder.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from '../../setting/settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { element } from 'protractor';
import { ValidatorType } from 'src/app/services/util.service';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'archit.gupta@gmail.com', name: 'ARN-83865', weight: 'Verification successful' },

];
@Component({
  selector: 'app-dashboard-guide-dialog',
  templateUrl: './dashboard-guide-dialog.component.html',
  styleUrls: ['./dashboard-guide-dialog.component.scss']
})
export class DashboardGuideDialogComponent implements OnInit {

  page = 1;
  step: number;

  serviceList = [
    { name: 'Portfolio review', selected: false },
    { name: 'Financial planning', selected: false },
    { name: 'Emergency planning', selected: false },
    { name: 'Insurance planning', selected: false },
    { name: 'Investment management', selected: false },
    { name: 'Investment consulting', selected: false },
    { name: 'Reitrement planning', selected: false },
    { name: 'Asset allocation', selected: false },
    { name: 'Tax planning', selected: false },
    { name: 'Cash flow planning', selected: false },
    { name: 'Real estate advisory', selected: false },
    { name: 'Will writing', selected: false },
    { name: 'Estate planning', selected: false },
    { name: 'Raising capital or Dept', selected: false },
    { name: 'Personal leading', selected: false },

  ]

  descriptionArray = [
    { name: 'I’ve been running a financial advisory practice for few years now.', selected: false, id: 1 },
    { name: 'I am new to this industry and just getting started.', selected: false, id: 2 }
  ]

  clientsWorkWithList = [
    { name: 'Salaried workoffice', selected: false },
    { name: 'Small buisness owners', selected: false },
    { name: 'Medical professionals', selected: false },
    { name: 'Finance professionals', selected: false },
    { name: 'Legal professionals', selected: false },
    { name: 'Buisness executives', selected: false },
    { name: 'Entreprenures', selected: false },
    { name: 'Retirees', selected: false },
    { name: 'Public sector workforce', selected: false },
    { name: 'HNI investors', selected: false },
    { name: 'UHNI investors', selected: false },
    { name: 'Institutional investors', selected: false },
  ]

  productList = [
    { name: 'Mutual funds', selected: false },
    { name: 'Stocks', selected: false },
    { name: 'Fixed income & Bonds', selected: false },
    { name: 'Life & General insurance', selected: false },
    { name: 'Post office schemes', selected: false },
    { name: 'PF & Pension schemes', selected: false },
    { name: 'Alternative investments', selected: false },
    { name: 'Commodities', selected: false },
    { name: 'Real estate', selected: false },
  ]

  mutualFundPractices = [
    { name: 'I offer mutual funds under my ARN/RIA code', selected: false, option: 'A' },
    { name: 'I work with a national distributor as a sub-broker', selected: false, option: 'B' },
    { name: 'I only give advice. I do not distribute or offer implementation services.', selected: false, option: 'C' },
    { name: 'Option a and b both applies to me', selected: false, option: 'D' },
  ]

  teamAloneList = [
    { name: 'I’m alone', selected: false, option: 'A', id: 1 },
    { name: 'I have a team', selected: false, option: 'B', id: 2 },
  ]

  addTeamMemberChoiceList = [
    { name: 'Sure, let’s add them', selected: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', selected: false, option: 'B', id: 2 },
  ]

  arnRiaCodeChoiceList = [
    { name: 'Yes', selected: false, option: 'A', id: 1 },
    { name: 'No', selected: false, option: 'B', id: 2 },
    { name: 'I have just started the process of registering', selected: false, option: 'C', id: 3 },
  ]

  basicDetailsChoiceList = [
    { name: 'Sure, let`s add', selected: false, option: 'A', id: 1 },
    { name: 'I`ll do this later', selected: false, option: 'B', id: 2 },
  ]

  rtaCredentialsChoiceList = [
    { name: 'Sure, let’s set-up auto forward', selected: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', selected: false, option: 'B', id: 2 },
  ]

  ArnRiaForm: FormGroup;
  credentialsForm: FormGroup;
  advisorId: any;
  step2Flag: boolean;
  step3Flag = 0;
  step4Flag = 0;
  step5Flag = 0
  step6Flag
  step7Flag;
  editPictureFlag;
  step8Flag: boolean;
  doItLater
  step9Flag: boolean;
  step10Flag: boolean;
  globalData: any;
  validatorType;
  arnRiaMaxlength: any;
  arnRtaData: any;
  selectedArnRIaChoice: any;
  basicDetailsChoice: any;
  selctedRtaDataChoice: any;
  selectedTeamMemberChoice: any;
  step11Flag: boolean;
  teamOrAloneSelectedData: any = {};
  selctedArmOrRia: any;
  selectedArmOrRiaIndex: any;


  constructor(private fb: FormBuilder,
    private settingService: SettingsService,
    private eventService: EventService,
    public dialogRef: MatDialogRef<DashboardGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.validatorType = ValidatorType
    this.advisorId = AuthService.getAdvisorId();
    this.step = 14;
    this.ArnRiaForm = this.fb.group({
      ArnRiaFormList: new FormArray([])
    })

    this.credentialsForm = this.fb.group({
      advisorId: [this.advisorId],
      camsEmail: [],
      camsPassword: [],
      karvyID: [],
      karvyPassword: [],
      karvyEMail: [],
      franklinEmail: [],
      franklinPassword: []
    })
    this.settingService.getArnGlobalData().subscribe((res) => {
      console.log(res)
      if (res) {
        this.globalData = res;
        this.addArnRiaForm();
      }
    });
    // this.getRtaDetails();
  }

  get getArnRiaForm() { return this.ArnRiaForm.controls; }
  get getArnRiaFormList() { return this.getArnRiaForm.ArnRiaFormList as FormArray; }

  addArnRiaForm() {
    this.getArnRiaFormList.push(this.fb.group({
      advisorId: [this.advisorId, []],
      arnOrRia: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      number: [, [Validators.required]],
      nameOfTheHolder: [, [Validators.required]]
    }))
  }

  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;

  showPageByIndex(index) {
    this.page = index;
  }

  changeNumberValidation(value) {
    if (value == 1) {
      this.arnRiaMaxlength = 6;
    } else {
      this.arnRiaMaxlength = 9
    }
    this.getArnRiaFormList.controls[this.getArnRiaFormList.length - 1].get('number').setValidators([Validators.maxLength(this.arnRiaMaxlength), Validators.minLength(this.arnRiaMaxlength)])
  }

  backStep() {
    this.step--;
  }

  selectPractice(selectedPractise) {
    this.step6Flag = true;
    this.mutualFundPractices.map(element => {
      (selectedPractise.name == element.name) ? element.selected = true : element.selected = false
    })
  }

  selectDes(selectDescription) {
    this.step2Flag = true
    this.descriptionArray.map(element => {
      (selectDescription.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectSingleOrTeam(singOrTeam) {
    this.step7Flag = true;
    this.teamOrAloneSelectedData = singOrTeam;
    this.teamAloneList.map(element => {
      (singOrTeam.id == element.id) ? element.selected = true : element.selected = false
    });
    (singOrTeam.id == 1) ? this.editPictureFlag = true : this.editPictureFlag = false;
  }

  selectAddTeamMemberChoice(selectChoice) {
    this.step8Flag = true
    this.selectedTeamMemberChoice = selectChoice
    this.addTeamMemberChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectarnRiaChoice(selectChoice) {
    this.step9Flag = true
    this.selectedArnRIaChoice = selectChoice;
    this.arnRiaCodeChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectbasicDetailsChoice(selectChoice) {
    this.step10Flag = true
    this.basicDetailsChoice = selectChoice;
    this.basicDetailsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectrtaCredentialsChoice(selectChoice) {
    this.step11Flag = true
    this.selctedRtaDataChoice = selectChoice;
    this.rtaCredentialsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.selected = true : element.selected = false
    })
  }

  selectService(service) {
    if (service.selected) {
      service.selected = false;
      this.step3Flag--;
    }
    else {
      service.selected = true;
      this.step3Flag++;
    }
  }

  selectClientWork(clientWork) {
    if (clientWork.selected) {
      clientWork.selected = false;
      this.step4Flag--;
    }
    else {
      clientWork.selected = true;
      this.step4Flag++;
    }
  }

  selectProduct(product) {
    if (product.selected) {
      product.selected = false;
      this.step5Flag--;
    }
    else {
      product.selected = true;
      this.step5Flag++;
    }
  }

  saveArnRiaForm(flag, index) {
    if (this.getArnRiaFormList.controls[index].invalid) {
      this.getArnRiaFormList.controls[index].markAllAsTouched();
      return;
    }
    // this.barButtonOptions.active = true;
    const jsonObj = {
      ...this.getArnRiaFormList.controls[index].value
    };

    if (this.getArnRiaFormList.controls[index].value.arnOrRia == 1) {
      jsonObj.number = 'ARN-' + jsonObj.number;
    } else {
      jsonObj.number = 'INA' + jsonObj.number;
    }
    this.settingService.addArn(jsonObj).subscribe((res) => {
      this.eventService.openSnackBar("ARN-RIA Added successfully");
      if (flag == 'addMore') {
        this.getArnRiaFormList.controls[index].get('arnOrRia').setValue('')
        this.getArnRiaFormList.controls[index].get('typeId').setValue('')
        this.getArnRiaFormList.controls[index].get('number').setValue('')
        this.getArnRiaFormList.controls[index].get('nameOfTheHolder').setValue('')
      }
      else {
        this.step++;
      }
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      // this.barButtonOptions.active = false;
    })
  }

  getRtaDetails() {
    this.settingService.getArnlist({ advisorId: this.advisorId }).subscribe((data) => {
      if (data) {
        data.forEach((element, index) => {
          (index == 0) ? element['colorFlag'] = true : element['colorFlag'] = false;
        });
        this.arnRtaData = data;
      }
    });
  }

  selectArnRia(data, selectedIndex) {
    this.selectedArmOrRiaIndex = selectedIndex;
    this.selctedArmOrRia = data;
    this.arnRtaData.forEach((element, index) => {
      (selectedIndex == index) ? element['colorFlag'] = true : element['colorFlag'] = false;
    });
  }

  addCredentialsJson() {
    this.credentialsForm = this.fb.group({
      camsEmail: [],
      camsPassword: [],
      karvyID: [],
      karvyPassword: [],
      karvyEMail: [],
      franklinEmail: [],
      franklinPassword: []
    })

    if (this.credentialsForm.controls.camsEmail.value != '') {
      let obj =
      {
        advisorId: [this.advisorId],
        rtTypeMasterid: '',
        arnOrRia: '',
        rtExtTypeId: [2], // dbf file extension
        arnRiaDetailsId: '',
        registeredEmail: '',
        mailbackPassword: '',
        fileOrderingUseabilityStatusId: [1]
      }
    }

    if (this.credentialsForm.controls.karvyID.value != '') {

      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: '',
        arnOrRia: '',
        rtTypeMasterid: '',
        loginId: '',
        loginPassword: '',
        rtExtTypeId: [2], // dbf file extension
        mailbackPassword: '',
        registeredEmail: '',
        fileOrderingUseabilityStatusId: '',
      }
    }

    if (this.credentialsForm.controls.franklinEmail.value != '') {

      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: '',
        arnOrRia: '',
        rtTypeMasterid: '',
        rtExtTypeId: [2], // dbf file extension
        loginId: '',
        loginPassword: '',
        mailbackPassword: '',
        registeredEmail: '',
        fileOrderingUseabilityStatusId: [1]
      }
    }

  }

  saveCredentials(obj) {
    this.settingService.addMFRTA(obj).subscribe((res) => {
      this.eventService.openSnackBar("CAMS Added successfully");
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

}

