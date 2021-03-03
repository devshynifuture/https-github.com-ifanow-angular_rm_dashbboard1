import { Component, OnInit, Input } from '@angular/core';
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
  inputData: any;
  edit: boolean;
  imgUrl: any;
  result: any;
  constructor(private eventService: EventService,
    private settingService: SettingsService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }
  @Input()
  set data(data) {
    this.inputData = data
    console.log('input date', data)
  }
  ngOnInit() {
    this.getTemplateList()
    this.setDataForm(this.inputData)
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
      imageUrl: gallery,
      template: true
    }
    const dialogRef = this.dialog.open(OpenGalleryPlanComponent, {
      width: '470px',
      height: '280px',
      data: { bank: gallery, animal: obj }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.result = result
        this.edit = true
        this.imgUrl = result.secure_url
        //this.addTemplates(result)
      }
    });
  }
  setDataForm(holderData) {
    const data = holderData;
    if (data) {
      this.edit = true
    }
    this.addTemplate = this.fb.group({
      name: [(!data) ? '' : (data.name), [Validators.required]],
      category: [(!data) ? '' : data.fpTemplateCategoryMasterId, [Validators.required]],
      imgUrl: [(!data) ? '' : data.imageUrl, [Validators.required]],
    });
    if (this.edit == true) {
      this.addTemplate.get('name').disable();
      this.addTemplate.get('category').disable();
      this.imgUrl = this.addTemplate.get('imgUrl').value
    }
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
    if (this.inputData.id) {
      var obj = {
        id: this.inputData.id,
        advisorId: AuthService.getAdvisorId(),
        name: this.addTemplate.get('name').value,
        imageUrl: this.result.secure_url,
        fpTemplateCategoryMasterId: this.addTemplate.get('category').value,
      };
      this.settingService.editTemplate(obj).subscribe(
        res => {
          this.eventService.openSnackBar("Template updated Successfully", 'Dismiss');
          this.close(true)
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    } else {
      var obj1 = {
        advisorId: AuthService.getAdvisorId(),
        name: this.addTemplate.get('name').value,
        imageUrl: this.result.secure_url,
        fpTemplateCategoryMasterId: this.addTemplate.get('category').value,
      };
      this.settingService.addNewTemplate(obj1).subscribe(
        res => {
          this.eventService.openSnackBar("Template added Successfully", 'Dismiss');
          this.close(true)
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }


  }

  getFormControl(): any {
    return this.addTemplate.controls;
  }
  getTemplateListResponse(data) {
    console.log('templatelist', data)
    this.templateList = data
    this.setDataForm(this.inputData)
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });

  }
}
