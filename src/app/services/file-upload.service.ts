import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';


export class FileUploadService {

  static uploadFileToServer(url: string, file: File, requestMap, successCallback) {
    const uploaderOptions: FileUploaderOptions = {
      url,
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      disableMultipart: false,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const uploader = new FileUploader(uploaderOptions);
    uploader.onAfterAddingFile = fileItem => {
    };
    uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      form.append('file', fileItem);
      fileItem.withCredentials = false;
      Object.keys(requestMap).map(key => {
        form.append(key, requestMap[key]);
      });
      return {fileItem, form};
    };
    uploader.onCompleteItem = successCallback;
    uploader.addToQueue([file], uploaderOptions);
    uploader.uploadAll();
  }
}
