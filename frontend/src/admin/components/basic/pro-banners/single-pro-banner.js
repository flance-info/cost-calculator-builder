export default {
  data() {
    return {
      column: 'column',
      row: 'row',
    };
  },

  props: ['link', 'img', 'width', 'list', 'height', 'video'],

  computed: {
    imgHeight() {
      if (this.height) {
        return this.height;
      }
      return '100%';
    },

    listStyle() {
      let list = JSON.parse(this.list);
      return {
        column: list.length < 3,
      };
    },

    checkList() {
      if (this.list) {
        return JSON.parse(this.list);
      }
      return false;
    },
  },

  template: `
    
        <div class="ccb-single-pro-feature" :style="{ 'max-width': width }">
            <div class="ccb-single-pro-feature__header">
                <div class="ccb-single-pro-feature__image-box">
                    <span class="ccb-single-pro-feature--icon-box">
                        <i class="ccb-icon-Lock"></i>
                    </span>
                    <span>This feature is available in the Pro version</span>
                </div>
                <div>
                    <a :href="link" target="_blank" class="ccb-button ccb-href success">Upgrade Now</a>
                </div>
            </div>
            <div class="ccb-single-pro-feature__content">
                <div class="ccb-single-pro-feature__checklist" v-if="checkList">
                   <ul :class="listStyle">
                        <li v-for="item in checkList">
                           <span class="icon">
                                <i class="ccb-icon-Checkmark-Circle-2"></i>
                            </span>
                           <span class="text" style="line-height: 1.4">{{ item }}</span>
                        </li>
                   </ul>
                </div>
                <div class="ccb-single-pro-feature__video" v-if="video">
                    <a :href="video" target="_blank">
                      <span class="icon">
                          <i class="ccb-icon-ccb-icon-video-play"></i>
                      </span>  
                      <span class="text">Watch video</span> 
                    </a>     
                </div>
                <div class="ccb-single-pro-feature__img" :style="{'height': imgHeight}">
                    <img :src="img" alt="nopro svg">
                </div>
            </div>
        </div>
    
    `,
};
