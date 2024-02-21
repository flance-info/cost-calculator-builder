export default {
  template: `
        <div class="ccb-option-inner image-val">
            <div class="ccb-image-select" v-if="thumbnail_url">
                <div class="ccb-image-value" :style="getWrapperStyles">
                    <img :src="thumbnail_url" alt="thumbnail_url" :style="getIconStyles"/>
                </div>
                <div class="ccb-image-value-delete" @click.prevent="clear">
                    <i class="ccb-icon-close"></i>
                </div>
            </div>
            <button class="ccb-button success" v-if="!thumbnail_url" @click.prevent="openMedia">{{ getPlaceholderText }}</button>
            <span :id="'errorOptionImage' + index"></span>
        </div>
    `,
  data: () => ({
    thumbnail_url: '',
  }),

  mounted() {
    if (this.url !== 'undefined') this.thumbnail_url = this.url;
  },

  methods: {
    openMedia() {
      const allowed = this.svg
        ? ['image/svg+xml']
        : ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
      if (
        typeof wp !== 'undefined' &&
        window.wp.media &&
        window.wp.media.editor
      ) {
        window.wp.media.editor.open();
        window.wp.media.editor.send.attachment = (props, attachment) => {
          if (allowed.includes(attachment.mime))
            this.thumbnail_url = attachment.url;
          this.update();
        };

        window.wp.media.editor.insert = (htmlString) => {
          const regex = /<img[^>]+src="([^"]+)"[^>]*>/i;
          const match = htmlString.match(regex);

          if (match && match[1]) {
            this.thumbnail_url = match[1];
            this.update();
          }
        };
      }
    },

    clear() {
      this.thumbnail_url = '';
      this.$emit('set', null, this.index, true);
    },

    update() {
      this.$emit('set', this.thumbnail_url, this.index);
    },
  },

  computed: {
    getPlaceholderText() {
      if (this.svg) {
        return 'Select Svg';
      }

      return this.select_text;
    },

    getIconStyles() {
      if (!this.svg) return {};

      return {
        width: '25px',
        height: '25px',
      };
    },

    getWrapperStyles() {
      if (!this.svg) return {};

      return {
        display: 'flex',
        alignItems: 'center',
        left: '10px',
      };
    },
  },

  props: ['url', 'index', 'id', 'select_text', 'svg'],
};
