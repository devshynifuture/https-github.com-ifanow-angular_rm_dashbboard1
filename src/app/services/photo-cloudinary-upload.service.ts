import {FileUploader, FileUploaderOptions} from "ng2-file-upload";


export class PhotoCloudinaryUploadService {

  static cloudName = 'futurewise';
  static uploadPreset = 'ifanow_unsigned_logo';

  static uploadFileToCloudinary(files: File[], folderName, tags, successCallback) {
    // folderName = biller_profile_logo
// Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const uploader = new FileUploader(uploaderOptions);
    uploader.addToQueue(files, uploaderOptions);
    uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.uploadPreset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      // let tags = 'BillerProfile';
      // if (this.title) {
      //   form.append('context', `photo=${this.title}`);
      //   tags = `myphotoalbum,${this.title}`;
      // }

      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      if (folderName) {
        form.append('folder', folderName);
      }
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return {fileItem, form};
    };

    uploader.onCompleteItem = successCallback;
    uploader.uploadAll();

  }
}
