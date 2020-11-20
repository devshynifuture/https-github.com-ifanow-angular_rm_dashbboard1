import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/js/froala_editor.pkgd.min';

import 'froala-editor/js/plugins/align.min.js';
// import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/help.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/print.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/save.min.js';
import 'froala-editor/js/plugins/special_characters.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import {AuthService} from "../../../../auth-service/authService";
import {appConfig} from "../../../../config/component-config";
import {apiConfig} from "../../../../config/main-config";

@Component({
  selector: 'app-froala',
  templateUrl: './froala.component.html',
  styleUrls: ['./froala.component.scss']
})
export class FroalaComponent implements ControlValueAccessor, OnInit {
  data: any;
  plainText: any;
  advisorId = 0;

  constructor() {
    this.advisorId = AuthService.getAdvisorId();

  }

  // End ControlValueAccesor methods.
  _model;
  editor;

  config: object = {
    // key: 'XD6C5A4H3G3A8aD6C4D3E3G3E2G2C9B3A4tFOFSAGLUd1AVKg1SN==', // For version less than 3
    key: 'XAG4eH3A3B10B8D6C5C-11VKOJ1FGULVKHXDXNDXc1d1Kg1SNdD5B4A4B3H3I3F3B7A4C3==', // for version 3
    attribution: false,
    imageUploadParams: {
      api_key: '628422498934552',
      upload_preset: 'froala_upload',
      tags: this.advisorId + '_froala_' + new Date(),
      folder: 'froala'

    },

    // Set the image upload URL.
    // imageUploadURL: 'https://api.cloudinary.com/v1_1/futurewise/image/upload',
    imageUploadURL: apiConfig.USER + appConfig.FROALA_UPLOAD_URL + this.advisorId,

    // Additional upload params.
    // imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],

    events: {
      'initialized': function (e, editor) {
        // console.log('froala initialized e: ', e);
        // console.log('froala initialized editor: ', editor);
        //
        // if (this.readonly) {
        //   editor.edit.off();
        // }
        // this.editor = editor;
      },
      'image.beforeUpload': function (images, e) {
        console.log('froala image beforeUpload : ', images);
        console.log('froala image beforeUpload e: ', e);

        // Return false if you want to stop the image upload.
      },
      'image.uploaded': function (response) {
        // Image was uploaded to the server.
        // response = JSON.parse(response);
        // console.log('froala image uploaded e: ', e);
        // console.log('froala image uploaded editor: ', editor);

        console.log('froala image uploaded response: ', response);
        // response = {link: response.secure_url};
        // console.log('froala image uploaded response: ', response.link);
        // this.editor.image.insertByUrl(response.link);
        // this.editor.image.get();
        // this.editor.image.insert(response.secure_url, false, null, this.editor.image.get(), response);
        // return false;
        // return response.secure_url;
      },
      'image.inserted': function ($img, response) {
        // Image was inserted in the editor.
        console.log('froala image inserted : ', $img, response);

      },
      'image.replaced': function ($img, response) {
        // Image was replaced in the editor.
        console.log('froala image replaced : ', $img, response);
      },
      'image.error': function (error, response) {
        // Bad link.
        console.log('froala image error: ', error);

        console.log('froala image error response: ', response);


        if (error.code == 1) {
        }

        // No link in upload response.
        else if (error.code == 2) {
        }

        // Error during image upload.
        else if (error.code == 3) {
        }

        // Parsing response failed.
        else if (error.code == 4) {
        }

        // Image too text-large.
        else if (error.code == 5) {
        }

        // Invalid image type.
        else if (error.code == 6) {
        }

        // Image can be uploaded only to same domain in IE 8 and IE 9.
        else if (error.code == 7) {
        }

        // Response contains the original server response to the request if available.
      }
    }
  };

  get model() {
    return this._model;
  }

  @Output() modelChange = new EventEmitter();

  @Input() set model(model) {
    console.log('froala set model : ', model);

    this._model = model;
  }

  @Input() readonly: boolean = false;

  ngOnInit(): void {

  }

  initFroala(e) {
    console.log('froala initFroala : ', e);

    e.initialize();

    const editor = e.getEditor();
    this.editor = editor;

    console.log('froala initFroala editor : ', editor);

    // editor('events.on', 'focus', () => {
    //   this.editor = editor;
    //   console.log('froala focus : ', editor);
    //
    // });
    // editor('events.on', 'blur', () => {
    //   this.editor = undefined;
    //   console.log('froala blur : ', editor);
    //
    // });
  }

  // Begin ControlValueAccesor methods.
  onChange = (data) => {
    // this.plainText = data.replace(/<[^>]*>/g, '');
    this.save(data);
  }
  onTouched = () => {
  }

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
    this.modelChange.emit(this.model);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  save(data) {
    console.log('froala save data : ', data);

    this.modelChange.emit(data);
  }

  // saveData(data) {
  //   this.modelChange.emit(data);
  // }
}
