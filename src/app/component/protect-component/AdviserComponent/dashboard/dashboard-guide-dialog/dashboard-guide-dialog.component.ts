import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from '../../setting/settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { AppConstants } from 'src/app/services/app-constants';
import { OrgSettingServiceService } from '../../setting/org-setting-service.service';
import { ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { PhotoCloudinaryUploadService } from 'src/app/services/photo-cloudinary-upload.service';
import { DashboardService } from '../dashboard.service';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

export interface DialogData {
  userData: any;
  masterGet: any;
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
    { name: 'Portfolio review', value: false },
    { name: 'Financial planning', value: false },
    { name: 'Emergency planning', value: false },
    { name: 'Insurance planning', value: false },
    { name: 'Investment management', value: false },
    { name: 'Investment consulting', value: false },
    { name: 'Reitrement planning', value: false },
    { name: 'Asset allocation', value: false },
    { name: 'Tax planning', value: false },
    { name: 'Cash flow planning', value: false },
    { name: 'Real estate advisory', value: false },
    { name: 'Will writing', value: false },
    { name: 'Estate planning', value: false },
    { name: 'Raising capital or Dept', value: false },
    { name: 'Personal leading', value: false },

  ]

  descriptionArray = [
    { name: 'I’ve been running a financial advisory practice for few years now.', value: false, id: 1 },
    { name: 'I am new to this industry and just getting started.', value: false, id: 2 }
  ]

  clientsWorkWithList = [
    { name: 'Salaried workforce', value: false },
    { name: 'Small Business owners', value: false },
    { name: 'Medical professionals', value: false },
    { name: 'Finance professionals', value: false },
    { name: 'Legal professionals', value: false },
    { name: 'Business executives', value: false },
    { name: 'Entreprenures', value: false },
    { name: 'Retirees', value: false },
    { name: 'Public sector workforce', value: false },
    { name: 'HNI investors', value: false },
    { name: 'UHNI investors', value: false },
    { name: 'Institutional investors', value: false },
  ]

  productList = [
    { name: 'Mutual funds', value: false },
    { name: 'Stocks', value: false },
    { name: 'Fixed income & Bonds', value: false },
    { name: 'Life & General insurance', value: false },
    { name: 'Post office schemes', value: false },
    { name: 'PF & Pension schemes', value: false },
    { name: 'Alternative investments', value: false },
    { name: 'Commodities', value: false },
    { name: 'Real estate', value: false },
  ]

  mutualFundPractices = [
    { name: 'I offer mutual funds under my ARN/RIA code', value: false, option: 'A', id: 1 },
    { name: 'I work with a national distributor as a sub-broker', value: false, option: 'B', id: 2 },
    { name: 'I only give advice. I do not distribute or offer implementation services.', value: false, option: 'C', id: 3 },
    { name: 'Option a and b both applies to me', value: false, option: 'D', id: 4 },
  ]

  teamAloneList = [
    { name: 'I’m alone', value: false, option: 'A', id: 1 },
    { name: 'I have a team', value: false, option: 'B', id: 2 },
  ]

  addTeamMemberChoiceList = [
    { name: 'Sure, let’s add them', value: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', value: false, option: 'B', id: 2 },
  ]

  arnRiaCodeChoiceList = [
    { name: 'Yes', value: false, option: 'A', id: 1 },
    { name: 'No', value: false, option: 'B', id: 2 },
    { name: 'I have just started the process of registering', value: false, option: 'C', id: 3 },
  ]

  basicDetailsChoiceList = [
    { name: 'Sure, let`s add', value: false, option: 'A', id: 1 },
    { name: 'I`ll do this later', value: false, option: 'B', id: 2 },
  ]

  rtaCredentialsChoiceList = [
    { name: 'Sure, let’s set-up auto forward', value: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', value: false, option: 'B', id: 2 },
  ]

  rtaCredentialsChoiceList1 = [
    { name: 'Sure, let’s set-up auto forward', value: false, option: 'A', id: 1 },
    { name: 'I’ll do this later', value: false, option: 'B', id: 2 },
  ]

  rolesList = [
    { name: 'Admin', value: false, option: 'A', id: 1 },
    { name: 'Back office', value: false, option: 'B', id: 2 },
    { name: 'Financial planner', value: false, option: 'C', id: 3 },
  ]

  uploadMfFIleOption = [
    { name: 'Order & Upload files for me please', value: false, option: 'A', id: 1 },
    { name: 'Do not order. I will manually do it.', value: false, option: 'B', id: 2 },
  ]

  ArnRiaForm: FormGroup;
  credentialsForm: FormGroup;
  advisorId: any;
  step2SelectedId: number;
  step3Flag = 0;
  step4Flag = 0;
  step5Flag = 0
  step6SelectedId: number;
  step7SelectedId: number;
  editPictureFlag;
  step8Flag: boolean;
  doItLater
  step9Flag: boolean;
  step10Flag: boolean;
  globalData: any;
  validatorType;
  arnRiaMaxlength: any;
  arnRtaData: any;
  valueArnRIaChoice: any;
  basicDetailsChoice: any;
  selctedRtaDataChoice: any = {};
  valueTeamMemberChoice: any;
  step11Flag: boolean;
  teamOrAloneSelectedData;
  selctedArmOrRia: any;
  valueArmOrRiaIndex: any;
  arnRiaList = [];
  ArnRiaIndex: any;
  valueArnRIa: any;
  formPlaceHolders
  stepRoleChoice: boolean;
  rolesFlag: boolean = true;
  addTeamMember;
  teamMemberForm: FormGroup;
  adminAdvisorId: any;
  selctedRoleChoice: any;
  step15Flag;
  selctedRtaDataChoice1: any;
  camsFlag: boolean = false;
  karvyFlag: boolean = false;
  franklinFlag: boolean = false;
  emailDetails: any;
  emailList: any;
  isLoading: boolean;
  step17Flag: boolean;
  valueMfOption: any;
  finalImage: any;
  imageUploadEvent: any;
  showCropper: boolean = false;
  imgURL = '';
  cropImage: boolean;
  showEditOption: boolean = false;
  hideWillDoLater: boolean;
  userInfo: any;
  questionData: any;
  answerObj: any;


  constructor(private fb: FormBuilder,
    private settingService: SettingsService,
    private eventService: EventService,
    public dialogRef: MatDialogRef<DashboardGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private orgSetting: OrgSettingServiceService,
    private utilService: UtilService,
    private dashService: DashboardService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.userInfo = this.data.userData;
    this.questionData = this.data.masterGet;
    this.formPlaceHolders = AppConstants.formPlaceHolders;
    this.validatorType = ValidatorType
    this.advisorId = AuthService.getAdvisorId();
    this.step = 1;
    this.valueArmOrRiaIndex = 0
    this.ArnRiaForm = this.fb.group({
      ArnRiaFormList: new FormArray([])
    })

    this.credentialsForm = this.fb.group({
      credentialsFormList: new FormArray([])
    })
    this.adminAdvisorId = AuthService.getAdminAdvisorId();
    this.teamMemberForm = this.fb.group({
      adminAdvisorId: [this.adminAdvisorId],
      parentId: this.advisorId,
      fullName: ['', [Validators.required]],
      emailId: [, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: [, [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      // isdCodeId: ['',[Validators.required]],
      roleId: [],
      url: []
    })
    this.settingService.getArnGlobalData().subscribe((res) => {
      console.log(res)
      if (res) {
        this.globalData = res;
        this.addArnRiaForm();
      }
    });
    this.getPersonalInfo()
    // this.getRtaDetails();
    this.getEmailVerification();
    this.getAnswerData()
  }

  getAnswerData() {
    const obj = {
      advisorId: this.advisorId
    }
    this.dashService.getOnBoardingQuestionAnswer(obj).subscribe(
      data => {
        if (data) {
          this.answerObj = data;
          // Object.entries(data).forEach(([key, value], index) => {
          //   console.log(`${index}: ${key} = ${value}`);
          //   if(value.val)
          // });
        }
      })
  }

  get getArnRiaForm() { return this.ArnRiaForm.controls; }
  get getArnRiaFormList() { return this.getArnRiaForm.ArnRiaFormList as FormArray; }

  get getCredentialsForm() { return this.credentialsForm.controls; }
  get getCredentialsFormList() { return this.getCredentialsForm.credentialsFormList as FormArray; }

  addArnRiaForm() {
    this.getArnRiaFormList.push(this.fb.group({
      advisorId: [this.advisorId, []],
      arnOrRia: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      number: [, [Validators.required]],
      nameOfTheHolder: [, [Validators.required]]
    }))
  }

  addCredentialsForm() {
    this.getCredentialsFormList.push(this.fb.group({
      advisorId: [this.advisorId],
      camsEmail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
      camsPassword: [''],
      karvyID: [''],
      karvyPassword: [''],
      karvyEMail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
      franklinID: [''],
      franklinPassword: [''],
      franklinEmail: ['', [Validators.pattern(ValidatorType.EMAIL)]],
    }))
  }


  displayedColumns: string[] = ['position', 'weight'];
  dataSource = ELEMENT_DATA;

  showPageByIndex(index) {
    this.page = index;
  }

  chooseArnRiaForm(index) {
    this.ArnRiaIndex = index;
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

  selectPractice(valuePractise) {
    this.step6SelectedId = valuePractise.id;
    this.mutualFundPractices.map(element => {
      (valuePractise.name == element.name) ? element.value = true : element.value = false
    })
  }

  selectDes(selectDescription) {
    this.step2SelectedId = selectDescription.id
    this.descriptionArray.map(element => {
      (selectDescription.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectSingleOrTeam(singOrTeam) {
    this.step7SelectedId = singOrTeam.id;
    this.teamOrAloneSelectedData = singOrTeam;
    this.teamAloneList.map(element => {
      (singOrTeam.id == element.id) ? element.value = true : element.value = false
    });
    (singOrTeam.id == 1) ? this.editPictureFlag = true : this.editPictureFlag = false;
  }

  selectAddTeamMemberChoice(selectChoice) {
    this.step8Flag = true
    this.valueTeamMemberChoice = selectChoice
    this.addTeamMemberChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectarnRiaChoice(selectChoice) {
    this.step9Flag = true
    this.valueArnRIaChoice = selectChoice;
    this.arnRiaCodeChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectbasicDetailsChoice(selectChoice) {
    this.step10Flag = true
    this.basicDetailsChoice = selectChoice;
    this.basicDetailsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectrtaCredentialsChoice(selectChoice) {
    this.step11Flag = true
    this.selctedRtaDataChoice = selectChoice;
    this.rtaCredentialsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectrtaCredentialsChoice1(selectChoice) {
    this.step15Flag = true
    this.selctedRtaDataChoice1 = selectChoice;
    this.rtaCredentialsChoiceList1.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectRoles(valueRole) {
    this.stepRoleChoice = true;
    this.editPictureFlag = true
    this.selctedRoleChoice = valueRole;
    this.rolesList.map(element => {
      (valueRole.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectUploadMfOption(selectChoice) {
    this.step17Flag = true
    this.valueMfOption = selectChoice;
    this.uploadMfFIleOption.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectService(service) {
    if (service.value) {
      service.value = false;
      this.step3Flag--;
    }
    else {
      service.value = true;
      this.step3Flag++;
    }
  }

  selectClientWork(clientWork) {
    if (clientWork.value) {
      clientWork.value = false;
      this.step4Flag--;
    }
    else {
      clientWork.value = true;
      this.step4Flag++;
    }
  }

  selectProduct(product) {
    if (product.value) {
      product.value = false;
      this.step5Flag--;
    }
    else {
      product.value = true;
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
        this.arnRiaList.push(jsonObj)
        this.addArnRiaForm();
        this.getArnRiaFormList.controls[index + 1].get('arnOrRia').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('typeId').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('number').setValue('')
        this.getArnRiaFormList.controls[index + 1].get('nameOfTheHolder').setValue('');
        this.valueArnRIa = '';
        this.ArnRiaIndex = index + 1;
      }
      else {
        this.getRtaDetails();
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
        this.selctedArmOrRia = data[0]
        data.forEach((element, index) => {
          this.addCredentialsForm();
          (index == 0) ? element['colorFlag'] = true : element['colorFlag'] = false;
        });
        this.arnRtaData = data;
      }
    });
  }

  selectArnRia(data, valueIndex) {
    this.valueArmOrRiaIndex = valueIndex;
    this.selctedArmOrRia = data;
    this.arnRtaData.forEach((element, index) => {
      (valueIndex == index) ? element['colorFlag'] = true : element['colorFlag'] = false;
    });
  }



  addCredentialsJson(index) {

    if (this.getCredentialsFormList.controls[index].invalid) {
      this.getCredentialsFormList.controls[index].markAllAsTouched();
      return
    }

    if (this.getCredentialsFormList.controls[index].value.camsEmail != '') {
      this.camsFlag = true;
      let obj =
      {
        advisorId: this.advisorId,
        rtTypeMasterid: 2,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtExtTypeId: 2, // dbf file extension
        arnRiaDetailsId: this.selctedArmOrRia.id,
        registeredEmail: this.getCredentialsFormList.controls[index].value.camsEmail,
        mailbackPassword: this.getCredentialsFormList.controls[index].value.camsPassword,
        fileOrderingUseabilityStatusId: 1
      }
      this.saveCredentials(obj, index, 'cams')
    }

    if (this.getCredentialsFormList.controls[index].value.karvyID != '') {
      this.karvyFlag = true;
      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.selctedArmOrRia.id,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtTypeMasterid: 1,
        loginId: this.getCredentialsFormList.controls[index].value.karvyID,
        loginPassword: this.getCredentialsFormList.controls[index].value.karvyPassword,
        rtExtTypeId: 2, // dbf file extension
        mailbackPassword: '',
        registeredEmail: this.getCredentialsFormList.controls[index].value.karvyEMail,
        fileOrderingUseabilityStatusId: 1,
      }
      this.saveCredentials(obj, index, 'karvy')
    }

    if (this.getCredentialsFormList.controls[index].value.franklinEmail != '') {
      this.franklinFlag = true;
      let obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: this.selctedArmOrRia.id,
        arnOrRia: this.selctedArmOrRia.arnOrRia,
        rtTypeMasterid: 3,
        rtExtTypeId: 2, // dbf file extension
        loginId: this.getCredentialsFormList.controls[index].value.franklinID,
        loginPassword: this.getCredentialsFormList.controls[index].value.franklinPassword,
        mailbackPassword: '',
        registeredEmail: this.getCredentialsFormList.controls[index].value.franklinEmail,
        fileOrderingUseabilityStatusId: 1
      }
      this.saveCredentials(obj, index, 'franklin')
    }

  }

  saveCredentials(obj, index, flag) {
    this.settingService.addMFRTA(obj).subscribe((res) => {
      if (flag == 'cams') {
        this.camsFlag = false
      } else if (flag == 'karvy') {
        this.karvyFlag = false
      }
      else {
        this.franklinFlag = false
      }
      this.loaderFun(index);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  loaderFun(index) {
    if (!this.camsFlag && !this.karvyFlag && !this.franklinFlag) {
      if (index == this.arnRtaData.length - 1) {
        this.step = 15;
      }
      else {
        this.valueArmOrRiaIndex = index + 1
        this.selctedArmOrRia = this.arnRtaData[index + 1];
        this.arnRtaData.forEach((element, index) => {
          if (this.valueArmOrRiaIndex == index) {
            element.colorFlag = true;
          } else {
            element.colorFlag = false;
          }
        })
      }
      this.eventService.openSnackBar("Credentials added successfully");
    } else {
    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getEmailVerification() {
    this.isLoading = true;
    this.emailList = [{}, {}]
    let obj = {
      userId: this.advisorId,
      // advisorId: this.advisorId
    }
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
      }
    );
  }

  getEmailVerificationRes(data) {
    if (data) {
      this.emailDetails = data
      this.emailList = data.listItems;
      this.isLoading = false;
    } else {
      this.emailList = []
    }
  }

  saveTeamMember(flag) {
    if (this.teamMemberForm.invalid) {
      this.teamMemberForm.markAllAsTouched();
      return
    }
    this.teamMemberForm.value.roleId = this.selctedRoleChoice.id
    const dataObj = this.teamMemberForm.value;
    this.settingService.addTeamMember(dataObj).subscribe((res) => {
      if (flag == 'addMore') {
        this.eventService.openSnackBar('Team member added successfully', "Dismiss");
        this.rolesList.map(element => element.value = false);
        this.rolesFlag = true
        this.step = 8.5;
        this.addTeamMember = false;
        this.selctedRoleChoice = undefined;
        this.stepRoleChoice = undefined;
        this.teamMemberForm.controls.fullName.setValue('')
        this.teamMemberForm.controls.emailId.setValue('');
        this.teamMemberForm.controls.mobileNo.setValue('')
        this.teamMemberForm.controls.roleId.setValue('')
      }
      else {
        this.eventService.openSnackBar('Invitation sent successfully', "Dismiss");
        this.step = 9
        this.editPictureFlag = true
      }
    }, (err) => {
      console.error(err);
      // this.barButtonOptions.active = false;
      this.eventService.openSnackBar(err, "Dismiss");
    });
  }

  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }

  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }


  saveImage() {
    if (this.showCropper) {
      const tags = this.advisorId + ',advisor_profile_logo,';
      const file = this.utilService.convertB64toImageFile(this.finalImage);
      PhotoCloudinaryUploadService.uploadFileToCloudinary([file], 'advisor_profile_logo', tags,
        (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const jsonDataObj = {
              id: this.advisorId,
              profilePic: responseObject.secure_url
            };
            this.settingService.uploadProfilePhoto(jsonDataObj).subscribe((res) => {
              this.imgURL = jsonDataObj.profilePic;
              this.hideWillDoLater = false;
              AuthService.setProfilePic(jsonDataObj.profilePic);
              this.eventService.openSnackBar('Image uploaded sucessfully', 'Dismiss');
            });
            this.resetPageVariables()
          }
        });
    }
  }

  cropImg(data) {
    this.cropImage = true;
    this.showCropper = true;
  }

  editImage() {
    (this.showEditOption) ? this.showEditOption = false : this.showEditOption = true;
  }
  getPersonalInfo() {
    this.settingService.getProfileDetails({ id: this.advisorId }).subscribe((res) => {
      this.imgURL = res.profilePic;
      if (this.imgURL == "http://res.cloudinary.com/futurewise/image/upload/v1585806986/advisor_profile_logo/gmtvhr0lwbskvlpucyfk.png") {
        this.hideWillDoLater = true;
      } else {
        this.hideWillDoLater = false;
      }
    });
  }

  resetPageVariables() {
    this.showCropper = false;
    this.cropImage = false;
    this.imageUploadEvent = '';
    this.finalImage = '';
  }

  insertOnboardingSteps(stepFlag, valueData) {
    let obj = {
      "id": {
        "name": "id",
        "value": this.answerObj.id ? this.answerObj.id.value : 0
      },
      "advisorId": {
        "name": "advisorId",
        "value": this.advisorId
      },
      "step1": {
        "name": "step1",
        "value": this.answerObj.step1 ? this.answerObj.step1.value : (this.step2SelectedId) ? this.step2SelectedId : 0
      },
      "step2": [
        {
          "name": "id",
          "value": this.answerObj.step2[0] ? this.answerObj.step2[0].value : 0
        },
      ],
      "step3": [
        {
          "name": "id",
          "value": this.answerObj.step3[0] ? this.answerObj.step3[0].value : 0
        },
      ],
      "step4": [
        {
          "name": "UHNI investors",
          "value": this.answerObj.step4[0] ? this.answerObj.step4[0].value : 0
        },
      ],
      "step5": {
        "name": "step5",
        "value": this.answerObj.step5 ? this.answerObj.step5.value : (this.step6SelectedId) ? this.step6SelectedId : null
      },
      "step6": {
        "name": "step6",
        "value": this.answerObj.step6 ? this.answerObj.step6.value : (this.step7SelectedId) ? this.step7SelectedId : null
      },
      "step7": {
        "name": "step7",
        "value": this.answerObj.step7 ? this.answerObj.step7.value : (this.teamOrAloneSelectedData) ? this.teamOrAloneSelectedData.id : null
      },
      "step8": {
        "name": "step8",
        "value": null
      },
      "step9": {
        "name": "step9",
        "value": null
      },
      "step10": {
        "name": "step10",
        "value": null
      },
      "step11": {
        "name": "step11",
        "value": null
      },
      "step12": {
        "name": "step12",
        "value": null
      },
      "step13": {
        "name": "step13",
        "value": null
      },
      "step14": {
        "name": "step14",
        "value": null
      },
      "step15": {
        "name": "step15",
        "value": null
      },
      "step16": {
        "name": "step16",
        "value": null
      },
      "step17": {
        "name": "step17",
        "value": null
      },
      "step18": {
        "name": "step18",
        "value": null
      },
      "step19": {
        "name": "step19",
        "value": null
      },
      "step20": {
        "name": "step20",
        "value": null
      },
      "isActive": 0,
      "createdDate": null,
      "lastUpdated": null,
      "step2Id": 1,
      "step3Id": 1,
      "step4Id": 1
    }
    obj.step2 = obj.step2.concat(this.serviceList)
    obj.step3 = obj.step3.concat(this.clientsWorkWithList);
    obj.step4 = obj.step4.concat(this.productList);
    if (this.answerObj.id != 0) {
      obj.step2 = obj.step2.concat({
        "name": "modified",
        "value": true
      })
    }
    if (this.answerObj.id != 0) {
      obj.step3 = obj.step3.concat({
        "name": "modified",
        "value": true
      })
    }
    if (this.answerObj.id != 0) {
      obj.step4 = obj.step4.concat({
        "name": "modified",
        "value": true
      })
    }
    console.log(obj)
    this.dashService.onBoardingQuestionAnswer(obj).subscribe(
      data => {
        if (data) {
          this.step++;
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dimiss");
      }
    )
  }


}

