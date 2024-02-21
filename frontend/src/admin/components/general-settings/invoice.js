import generalSettingsMixin from './generalSettingsMixin';
import settingsProBanner from '../basic/pro-banners/settings-pro-banner';

export default {
  data() {
    return {
      filePath: null,
      buttonDisable: false,
      fileUrl: '',
      uploadFile: null,
      showUrlInput: false,
      allowedFormats: ['png', 'jpg', 'jpeg', 'svg'],
      error: false,
    };
  },
  components: {
    settingsProBanner,
  },
  methods: {
    async addImg(event) {
      this.buttonDisable = true;
      this.uploadFile = event.target.files[0];
      await this.saveImage();
    },

    validateImg(img) {
      let result = true;
      let fileSizeInMB = (img.size / (1024 * 1024)).toFixed(2);

      if (fileSizeInMB > 10) {
        this.error = 'File size is too large';
        result = false;
      }

      if (
        !this.allowedFormats.includes(img.name.split('.').pop().toLowerCase())
      ) {
        this.error = 'Format not supported';
        result = false;
      }

      return result;
    },

    showUrl() {
      this.error = false;
      this.showUrlInput = true;
    },

    async saveImage() {
      if (this.validateImg(this.uploadFile)) {
        const formData = new FormData();
        formData.append('action', 'save_invoice_logo');
        formData.append('nonce', window.ccb_nonces.ccb_save_invoice_logo);
        formData.append('file', this.uploadFile);
        let response = await fetch(window.ajax_window.ajax_url, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        this.filePath = result.data.file_url;
        this.showUrlInput = false;
      } else {
        this.clear();
      }
    },

    chooseFile() {
      this.error = false;
      this.$refs.file.click();
    },

    clear() {
      this.$refs.file.value = '';
      this.filePath = '';
      this.buttonDisable = false;
    },

    async downloadByUrl() {
      let filePath = this.fileUrl.split('/').pop().split('#')[0].split('?')[0];

      if (
        this.allowedFormats.includes(filePath.split('.').pop().toLowerCase())
      ) {
        fetch(this.fileUrl)
          .then((response) => {
            if (response.ok) {
              this.buttonDisable = true;
              this.error = '';
              return response.blob();
            } else {
              this.error = 'Url is not correct';
            }
          })
          .then((blob) => {
            if (filePath.lastIndexOf('.') === -1) {
              let extension = blob.type.split('/')[1].toLowerCase();
              filePath = filePath + '.' + extension;
            }
            this.uploadFile = new File([blob], filePath, { type: blob.type });

            this.saveImage();
          });
      } else {
        this.error = 'Url is not correct';
      }
    },
  },
  mounted() {
    this.filePath = this.generalSettings.invoice.companyLogo;

    if (this.filePath) {
      this.buttonDisable = true;
      this.showUrlInput = false;
    }
  },
  computed: {
    buttonTextPreview() {
      let btnText = this.generalSettings.invoice.buttonText;

      return btnText.length < 10 ? btnText : btnText.substr(0, 10) + '...';
    },

    imgName() {
      let s = this.filePath.split('/');
      return s[s.length - 1];
    },
  },

  watch: {
    filePath(val) {
      this.generalSettings.invoice.companyLogo = val;
    },
  },
  mixins: [generalSettingsMixin],
};
