export default {
  props: ['title', 'subtitle', 'text', 'link', 'img', 'imgHeight'],

  template: `
        <div class="ccb-grid-box">
            <div class="container">
                <div class="ccb-p-t-15 ccb-p-b-15 ccb-pro-feature-section-wrapper">
                    <div class="ccb-pro-feature-section-wrapper__item">
                        <div class="ccb-pro-feature-section">
                            <div class="ccb-pro-feature-section__title">{{ title }}</div>
                            <div class="ccb-pro-feature-section-description">
                                <div class="ccb-pro-feature-section-description__title">
                                    🔒
                                    <span>{{ subtitle }}</span>
                                </div>
                            <div class="ccb-pro-feature-section-description__text">
                                {{ text }}
                            </div>
                            <a :href="link" target="_blank" class="ccb-button ccb-href success">Upgrade Now</a>
                        </div>
                    </div>
                </div>
                    <div class="ccb-pro-feature-section-wrapper__item" style="text-align: right;">
                        <img :src="img" alt="Cost Calculator Email Template" :style="{'height': imgHeight}">
                    </div>
                </div>
            </div>
        </div>
    
    `,
};
