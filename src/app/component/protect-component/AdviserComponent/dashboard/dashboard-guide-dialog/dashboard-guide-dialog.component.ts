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
    { name: 'Sure, let’s add RTA credentials', value: false, option: 'A', id: 1 },
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
  step2SelectedId: number = 0;
  step3Flag = 0;
  step4Flag = 0;
  step5Flag = 0
  step6SelectedId: number = 0;
  step7SelectedId: number = 0;
  editPictureFlag;
  step8Selected: number = 0;
  doItLater
  step9SelectedId: number = 0;
  step10SelectedId: number = 0;
  globalData: any;
  validatorType;
  arnRiaMaxlength: any;
  arnRtaData: any;
  selectedArnRIaChoice: any;
  basicDetailsChoice: any;
  selctedRtaDataChoice: any = {};
  valueTeamMemberChoice: any;
  step11SelectedId: number = 0;
  teamOrAloneSelectedData;
  selctedArmOrRia: any;
  selectedArmOrRiaIndex: any;
  arnRiaList = [];
  ArnRiaIndex: any;
  valueArnRIa: any;
  formPlaceHolders
  stepRoleChoiceID: number = 0;
  rolesFlag: boolean = true;
  addTeamMember;
  teamMemberForm: FormGroup;
  adminAdvisorId: any;
  selctedRoleChoice: any;
  step15SelectedId: number = 0;
  selctedRtaDataChoice1: any;
  camsFlag: boolean = false;
  karvyFlag: boolean = false;
  franklinFlag: boolean = false;
  emailDetails: any;
  emailList: any;
  isLoading: boolean;
  step17Selected: number = 0;
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
  addArnRiaFlag: boolean;
  saveCreds: boolean;
  addTeamMemberflag: boolean;


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
    this.selectedArmOrRiaIndex = 0
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
          this.getAdvisorStepWhereLeft(data.nextStep);
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
    this.step8Selected = selectChoice.id;
    this.valueTeamMemberChoice = selectChoice
    this.addTeamMemberChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectarnRiaChoice(selectChoice) {
    this.step9SelectedId = selectChoice.id
    this.selectedArnRIaChoice = selectChoice;
    this.arnRiaCodeChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectbasicDetailsChoice(selectChoice) {
    this.step10SelectedId = selectChoice.id;
    this.basicDetailsChoice = selectChoice;
    this.basicDetailsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectrtaCredentialsChoice(selectChoice) {
    this.step11SelectedId = selectChoice.id;
    this.selctedRtaDataChoice = selectChoice;
    this.rtaCredentialsChoiceList.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectrtaCredentialsChoice1(selectChoice) {
    this.step15SelectedId = selectChoice.id
    this.selctedRtaDataChoice1 = selectChoice;
    this.rtaCredentialsChoiceList1.map(element => {
      (selectChoice.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectRoles(valueRole) {
    this.stepRoleChoiceID = valueRole.id;
    this.editPictureFlag = true
    this.selctedRoleChoice = valueRole;
    this.rolesList.map(element => {
      (valueRole.id == element.id) ? element.value = true : element.value = false
    })
  }

  selectUploadMfOption(selectChoice) {
    this.step17Selected = selectChoice.id
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
        this.addArnRiaFlag = true;
        this.insertOnboardingSteps(null, null);
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
    this.selectedArmOrRiaIndex = valueIndex;
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
        this.saveCreds = true;
        this.insertOnboardingSteps(null, null)
      }
      else {
        this.selectedArmOrRiaIndex = index + 1
        this.selctedArmOrRia = this.arnRtaData[index + 1];
        this.arnRtaData.forEach((element, index) => {
          if (this.selectedArmOrRiaIndex == index) {
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
        this.stepRoleChoiceID = 0;
        this.teamMemberForm.controls.fullName.setValue('')
        this.teamMemberForm.controls.emailId.setValue('');
        this.teamMemberForm.controls.mobileNo.setValue('')
        this.teamMemberForm.controls.roleId.setValue('')
      }
      else {
        this.eventService.openSnackBar('Invitation sent successfully', "Dismiss");
        this.step = 9
        this.editPictureFlag = true;
        this.addTeamMember = false;
        this.addTeamMemberflag = true;
        this.insertOnboardingSteps(9, null);
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
          "name": "id",
          "value": this.answerObj.step4[0] ? this.answerObj.step4[0].value : 0
        },
      ],
      "step5": {
        "name": "step5",
        "value": this.answerObj.step5 && this.answerObj.step5.value != 0 ? this.answerObj.step5.value : (this.step6SelectedId) ? this.step6SelectedId : 0
      },
      "step6": {
        "name": "step6",
        "value": this.answerObj.step6 && this.answerObj.step6.value != 0 ? this.answerObj.step6.value : (this.step7SelectedId) ? this.step7SelectedId : 0
      },
      "step7": {
        "name": "step7",
        "value": this.answerObj.step7 && this.answerObj.step7.value != 0 ? this.answerObj.step7.value : (this.step8Selected) ? this.step8Selected : 0
      },
      "step8": {
        "name": "step8",
        "value": this.answerObj.step8 && this.answerObj.step8.value != 0 ? this.answerObj.step8.value : (this.stepRoleChoiceID) ? this.stepRoleChoiceID : 0
      },
      "step9": {
        "name": "step9",
        "value": this.answerObj.step9 && this.answerObj.step9.value != 0 ? this.answerObj.step9.value : (this.addTeamMemberflag) ? 1 : 0
      },
      "step10": {
        "name": "step10",
        "value": this.answerObj.step10 && this.answerObj.step10.value != 0 ? this.answerObj.step10.value : (this.doItLater) ? 1 : 0
      },
      "step11": {
        "name": "step11",
        "value": this.answerObj.step11 && this.answerObj.step11.value != 0 ? this.answerObj.step11.value : (this.step9SelectedId) ? this.step9SelectedId : 0
      },
      "step12": {
        "name": "step12",
        "value": this.answerObj.step12 && this.answerObj.step12.value != 0 ? this.answerObj.step12.value : (this.step10SelectedId) ? this.step10SelectedId : 0
      },
      "step13": {
        "name": "step13",
        "value": this.answerObj.step13 && this.answerObj.step13.value != 0 ? this.answerObj.step13.value : (this.addArnRiaFlag) ? 1 : 0
      },
      "step14": {
        "name": "step14",
        "value": this.answerObj.step14 && this.answerObj.step14.value != 0 ? this.answerObj.step14.value : (this.step11SelectedId) ? this.step11SelectedId : 0
      },
      "step15": {
        "name": "step15",
        "value": this.answerObj.step15 && this.answerObj.step15.value != 0 ? this.answerObj.step15.value : (this.saveCreds) ? 1 : 0
      },
      "step16": {
        "name": "step16",
        "value": this.answerObj.step16 && this.answerObj.step16.value != 0 ? this.answerObj.step16.value : (this.step15SelectedId) ? this.step15SelectedId : 0
      },
      "step17": {
        "name": "step17",
        "value": this.answerObj.step16 && this.answerObj.step16.value != 0 ? this.answerObj.step16.value : (valueData == 'doneDown') ? 1 : 0
      },
      "step18": {
        "name": "step18",
        "value": this.answerObj.step17 && this.answerObj.step17.value != 0 ? this.answerObj.step17.value : (this.step17Selected) ? this.step17Selected : 0
      },
      "step19": {
        "name": "step19",
        "value": (valueData == 'finish') ? 1 : 0
      },
      "step20": {
        "name": "step20",
        "value": (valueData == 'close') ? 1 : 0
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
          this.answerObj = data;
          if (valueData != 'close') {
            // if (this.editPictureFlag) {
            //   this.step = 9
            // }
            // else {
            if (stepFlag == undefined) {
              this.step++;
            }
            // }
          } else {
            this.step = 19
          }

          if (stepFlag) {
            this.step = stepFlag;
          }
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dimiss");
      }
    )
  }

  getAdvisorStepWhereLeft(flag) {
    switch (true) {
      case flag == 'step1':
        this.step = 1;
        break;
      case flag == 'step2':
        this.step = 2;
        break;
      case flag == 'step3':
        this.step = 3;
        break;
      case flag == 'step4':
        this.step = 4;
        break;
      case flag == 'step5':
        this.step = 5;
        break;
      case flag == 'step6':
        this.step = 6;
        break;
      case flag == 'step7':
        this.step = 8;
        break;
      case flag == 'step8':
        this.step = 8.5;
        this.rolesFlag = true;
        break;
      case flag == 'step9':
        this.step = 9.5;
        this.addTeamMember = true;
        this.rolesFlag == false
        break;
      case flag == 'step10':
        this.step = 9;
        this.editPictureFlag = true;
        break;
      case flag == 'step11':
        this.step = 10;
        break;
      case flag == 'step12':
        this.step = 11;
        break;
      case flag == 'step13':
        this.step = 12;
        break;
      case flag == 'step14':
        this.step = 13;
        break;
      case flag == 'step15':
        this.step = 14;
        break;
      case flag == 'step16':
        this.step = 15;
        break;
      case flag == 'step17':
        this.step = 16;
        break;
      default:
        this.step = 17;
    }
  }


}

