import templateList from './template-list'
import ccbTemplateModalWindow from './templates-modal'
import ccbFreeTemplateContent from './template-free'
import ccbProTemplateContent from './template-pro'

export default {
    components: {
        'template-list': templateList,
        'template-modal-window': ccbTemplateModalWindow,
        'template-free-content': ccbFreeTemplateContent,
        'template-pro-content': ccbProTemplateContent
    },

    data() {
        return {
            category: 'all',
            search: '',
            createNewList: [
                {
                    icon: 'ccb-icon-Path-3453',
                    category: 'blank',
                    type: 'blank',
                    title: 'New Blank Form',
                    description: 'Create a new form from scratch.',
                    action: 'blank',
                }
            ],
        }
    },
    computed: {
        showPopularTemplates() {
            return this.popularTemplates.length > 0 && this.category === 'popular' || this.category === 'all'
        },

        popularTemplates() {
            return this.$store.getters.getTemplates.filter(t => t.popular)
        },

        categories() {
            return this.$store.getters.getTempCategories
        },

        tempCustomTemplates() {
            return this.$store.getters.getTemplates.filter(t => t.category === 'custom_templates')
        },

        favoriteTemplates() {
            const favoriteTemplates = this.$store.getters.getFavorites.map(w_id => this.$store.getters.getTemplates.find(t => t.template_id === w_id))
            return favoriteTemplates.filter(w => w)
        },

        preloader: {
            get() {
                return this.$store.getters.getGlobalLoader
            },

            set(value) {
                this.$store.commit('updateGlobalLoader', value);
            }
        },

        beforeTemplates() {
            const templates = this.templatesByCategory
            if ( this.search.trim() === "" ) {
                return this.filterPopularTemplates(templates[0])
            }

            return templates
        },

        afterTemplates() {
            const templates = this.templatesByCategory
            if ( this.search.trim() === "" ) {
                let result = templates.filter((t, idx) => idx !== 0)

                return this.filterPopularTemplates(result)
            }

            return []
        },

        templatesByCategory() {
            let data = [];

            if ( this.category === 'popular') {
                const templates = this.$store.getters.getTemplates.filter(t => t.popular)
                data.push({
                    title: 'Popular Templates',
                    templates
                })
            }

            if ( this.category === 'all' ) {
                this.categories.forEach(c => {
                    const templates = this.$store.getters.getTemplates.filter(t => t.category === c.slug)
                    data.push({
                        title: c.title,
                        templates
                    })
                })

                const templates = this.$store.getters.getTemplates.filter(t => t.popular)
                data.unshift({
                    title: 'Popular Templates',
                    templates
                })


            } else {
                const cat = this.$store.getters.getTempCategories.find(c => c.slug === this.category)
                if ( cat ) {
                    const templates = this.$store.getters.getTemplates.filter(t => t.category === cat.slug)
                    data.push({
                        title: cat.title,
                        templates
                    })
                }
            }

            if (this.search.trim() !== "") {
                data = data.map(t => {
                    t.templates = t.templates.filter(temp => temp.title.toLowerCase().includes(this.search.toLowerCase()))
                    return t
                })
            }

            return data.map(d => {
                d.templates.sort((a, b) => a.type < b.type ? -1 : 1)
                return d
            })
        },
    },

    methods: {
        toggleFavorite(template_id) {
            this.$store.dispatch('toggleFavorite', {template_id})
        },

        filterPopularTemplates(data) {
            let result = Array.isArray(data) ? data : [data]
            return result.map(item => ({
                ...item,
                templates: item.templates.filter(t => t.popular).concat(item.templates.filter(t => !t.popular))
            }));
        }
    },

    async mounted() {
        await this.$store.dispatch('getTemplates');
        setTimeout(() => {
            this.preloader = false
        }, 300)
    },
}