import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from '../../../../settings.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder } from '@angular/forms';
import { OpenGalleryPlanComponent } from '../../plan-gallery/open-gallery-plan/open-gallery-plan.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-new-template',
  templateUrl: './add-new-template.component.html',
  styleUrls: ['./add-new-template.component.scss']
})
export class AddNewTemplateComponent implements OnInit {
  templateList: any;
  addTemplate: any;
  imageUploadEvent: any;
  showCropper: boolean;
  profileImg: any;
  finalImage: any;
  constructor(private eventService: EventService,
    private settingService: SettingsService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.setDataForm(null)
    this.getTemplateList()
  }
  uploadImageForCorping(event) {
    this.imageUploadEvent = event;
    this.showCropper = true;
  }
  showCroppedImage(imageAsBase64) {
    setTimeout(() => {
      this.finalImage = imageAsBase64;
    });
  }
  openGallery(gallery) {
    let obj = {
      imageUrl: gallery
    }
    const dialogRef = this.dialog.open(OpenGalleryPlanComponent, {
      width: '470px',
      height: '280px',
      data: { bank: gallery, animal: obj }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getDefault()
      }
    });
  }
  setDataForm(holderData) {
    const data = holderData;
    this.addTemplate = this.fb.group({
      name: [(!data) ? '' : (data.nationality) ? data.nationality + '' : '1', [Validators.required]],
      category: [(!data) ? '' : data.income, [Validators.required]],
      imgUrl: [(!data) ? '' : data.placeOfBirth, [Validators.required]],
    });
  }
  getTemplateList() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.settingService.getTemplateList(obj).subscribe(
      res => {
        this.getTemplateListResponse(res);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  addTemplates() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      name: "Manual Template",
      imageUrl: "https://3mizy13z0lac30t3qw3dz1bj-wpengine.netdna-ssl.com/wp-content/uploads/2019/06/Ten-Steps-to-create-a-financial-plan.jpg",
      fpTemplateCategoryMasterId: 1
    };
    this.settingService.addNewTemplate(obj).subscribe(
      res => {
        this.addNewTemplateResponse(res);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  addNewTemplateResponse(data) {

  }
  getFormControl(): any {
    return this.addTemplate.controls;
  }
  getTemplateListResponse(data) {
    console.log('templatelist', data)
    this.templateList = data
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }
}
