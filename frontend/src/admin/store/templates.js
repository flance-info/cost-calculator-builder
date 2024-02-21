import fetchRequest from "@plugins/fetchRequest"
import {toast} from "../../utils/toast";

export default {
    state: {
        globalLoader: true,
        templates: [],
        categories: [],
        favorites: [],
        templateModalType: '',
        openTemplateModal: false,
        templateModalHide: false,
        adminEmail: '',
        code: '',
        unlock: false,
        proActive: false,
        popularTemplates: [
            'ROI Calculator', 'Cleaning Company', 'Simple Mortgage Calculator', 'Advanced Mortgage Calculator', 'Loan Calculator', 'Compound Interest Calculator', 'Daily Calorie Intake Calculator', 'Interior Design Booking',
            'BMI (Body Mass Index) Calculator', 'Wedding Planner Booking', 'Car Wash', 'Conversion Calculator', 'Renovation', 'Car Rental', 'Discount Calculator', 'Insurance Booking', 'School Trip PayPal Payment',
            'Insurance Booking', 'Venue Rental', 'Savings and Investment Calculator', 'Fuel Cost Calculator', 'VAT Calculator', 'Tip Calculator', 'Funeral Home Company', 'School Residential Payment', 'Graphic Designing',
            'Property Viewing Booking'
        ],
    },

    mutations: {
        setProActive(state, value) {
            state.proActive = value
        },

        setUnlock(state, value) {
            state.unlock = value
        },

        setCode(state, code) {
            state.code = code
        },

        setAdminEmail(state, email) {
            state.adminEmail = email
        },

        setTemplateModalType(state, value) {
            state.templateModalType = value
        },

        setOpenTemplateModal(state, value) {
            state.openTemplateModal = value
        },

        setTemplateModalHide(state, value) {
            state.templateModalHide = value
        },

        updateGlobalLoader(state, value) {
            state.globalLoader = value
        },

        updateTemplate(state, templates) {
            let popularTemplates = state.popularTemplates;
            state.templates = templates.map(template => {
                if (popularTemplates.includes(template.title)) {
                    template.popular = true;
                }

                return template;
            })
        },
        
        updateCategories(state, categories) {
            state.categories = categories
        },

        updateFavorites(state, favorites) {
            state.favorites = favorites.map(w => +w)
        },
    },

    actions: {
        async getCodeAction({getters}) {
            await fetch(`${window.ajaxurl}?action=calc_get_code&nonce=${window.ccb_nonces.ccb_get_code}&email=${getters.getAdminEmail}`);
        },

        async unlockTemplates({commit}) {
            commit('setUnlock', true)
            await fetch(`${window.ajaxurl}?action=calc_send_code&nonce=${window.ccb_nonces.ccb_send_code}`);
        },

        async getTemplates({commit}) {
            commit('updateGlobalLoader', true)

            const data = await fetch(`${window.ajaxurl}?action=calc_get_templates_list&nonce=${window.ccb_nonces.ccb_get_templates}`);
            const response = await data.json();

            if (response && response.admin_email) {
                commit('setAdminEmail', response.admin_email)
            }

            if (response && response.pro_active) {
                commit('setProActive', response.pro_active)
            }

            if (response && response.unlock) {
                commit('setUnlock', response.unlock)
            }

            if (response && response.templates) {
                commit('updateTemplate', Object.values(response.templates))
            }

            if (response && response.categories) {
                commit('updateCategories', Object.values(response.categories))
            }

            if (response && response.favorites) {
                commit('updateFavorites', Object.values(response.favorites))
            }

            commit('updateGlobalLoader', false)
        },

        async deleteTemplateAction({commit}, {id}) {
            commit('updateGlobalLoader', true)

            const data = await fetch(`${window.ajaxurl}?template_id=${id}&action=calc_delete_templates&nonce=${window.ccb_nonces.ccb_delete_template}`);
            const response = await data.json();

            if (response && response.templates) {
                commit('updateTemplate', Object.values(response.templates))
            }

            commit('updateGlobalLoader', false)
        },

        async createBlankAction({commit}) {
            fetchRequest(`${window.ajaxurl}?action=calc_create_id&nonce=${window.ccb_nonces.ccb_create_id}`, 'POST')
                .then(response => response.json())
                .then(response => {
                    if ( response && response.id ) {
                        window.location.replace( response.url );
                    }
                })
        },

        async useTemplateAction({commit}, {template_id}) {
            const data = { template_id }
            fetchRequest(`${window.ajaxurl}?action=calc_use_template&nonce=${window.ccb_nonces.ccb_use_template}`, 'POST', data)
                .then(response => response.json())
                .then(response => {
                    if (response && response.url) {
                        window.location.replace(response.url);
                    }
                })
        },

        async toggleFavorite({commit, state}, {template_id}) {
            const data = { template_id }
            fetchRequest(`${window.ajaxurl}?action=calc_toggle_favorite&nonce=${window.ccb_nonces.ccb_toggle_favorite}`, 'POST', data)
                .then(response => response.json())
                .then(response => {
                    if (response && response.favorites) {
                        commit('updateFavorites', Object.values(response.favorites))
                        toast(response.message, response.success ? 'success' : 'error')
                    }
                })
        },
    },

    getters: {
        getProActiveTemplate: s => s.proActive,
        getUnlock: s => s.unlock,
        getCode: s => s.code,
        getAdminEmail: s => s.adminEmail,
        getGlobalLoader: s => s.globalLoader,
        getTemplates: s => s.templates,
        getTempCategories: s => s.categories,
        getFavorites: s => s.favorites,
        getTemplateModalType: s => s.templateModalType,
        getOpenTemplateModal: s => s.openTemplateModal,
        getTemplateModalHide: s => s.templateModalHide,
        getPopularTemplates: s => s.popularTemplates,
    }
}
