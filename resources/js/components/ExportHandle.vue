<template>
    <div class="export-handle">
        <div class="export-handle-header">Export full dashboards as PDF using <a href="https://www.fusioncharts.com/fusionexport" alt="FusionExport" target="_blank">FusionExport</a>. Try below.</div>

        <div class="export-handle-button-wrapper">
            <button
                type="button"
                class="btn export-handle-button"
                @click="exportClickListener">
                <i class="icn icn-download"/>
                <span>Download Dashboard</span>
            </button>
            <button
                type="button"
                class="btn export-handle-button"
                @click="reportClickListener">
                <i class="icn icn-download"/>
                <span>Download Full Report</span>
            </button>
            <button
                type="button"
                class="btn export-handle-button"
                @click="mailClickListener">
                <i class="icn icn-send"/>
                <span>Email this Dashboard</span>
            </button>
        </div>

        <Modal
            name="mail-form"
            classes="mail-modal"
            height="auto"
            transition="modal"
            :delay="100"
            :clickToClose="modalClickToClose"
            @closed="modalClosedListener()">
            <transition name="screen" mode="out-in">
                <div class="mail-modal-screen" v-if="!showSuccessScreen" key="main">
                    <div class="close-button" @click="modalCloseClickListener()">×</div>
                    <h2 class="mail-modal-header">Email this dashboard to yourself</h2>
                    <p class="mail-modal-subheader">Please provide your email to receive the dashboard via email</p>
                    <form
                        action="#"
                        @submit.prevent="sendMailClickListener"
                        class="mail-modal-actionbox">
                        <input
                            class="mail-modal-input"
                            :class="mailInputStatus"
                            v-validate="'required|email'"
                            type="text"
                            name="mailId"
                            v-model="mailId"
                            placeholder="Enter Email ID"
                            @blur="inputBlurListener()">
                        <button
                            type="submit"
                            class="btn export-handle-button mr-0"
                            :disabled="!validateForm()">
                            <i class="icn icn-send"/>
                            <span>Send</span>
                        </button>
                        <p class="error-message">{{ errorMessage }}</p>
                    </form>
                    <p class="mail-modal-message">{{ resultMessage }}</p>
                    <p class="mail-modal-privacy-message">By signing up you agree to FusionCharts <a rel="noopener" href="https://www.fusioncharts.com/privacy-policy" target="_blank">privacy policy</a></p>
                </div>
                <div class="mail-modal-screen" v-if="showSuccessScreen" key="success">
                    <div class="close-button" @click="modalCloseClickListener()">×</div>
                    <div><i class="icn icn-big icn-green icn-done"/></div>
                    <h2 class="mail-modal-header">Hurray</h2>
                    <p class="mail-modal-subheader">This dashboard has been emailed to you successfully. Please check <a :href="inboxLink" target="_blank">your inbox</a>.</p>
                </div>
            </transition>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import download from 'downloadjs';

const baseUrl = process.env.BASE_URL || '/api';
const inboxProviderMap = {
    'gmail'  : 'https://mail.google.com',
    'ymail'  : 'https://mail.yahoo.com',
    'hotmail': 'https://outlook.live.com',
}

export default {
    data() {
        return {
            mailId: null,
            mailInputStatus: {},
            modalClickToClose: true,
            resultMessage: '',
            showSuccessScreen: false,
            showErrorMessage: false,
        }
    },

    props: {
        filter: {
            type: Object,
            default: () => {}
        },
    },

    computed: {
        data() {
            return {
                filter: this.filter,
                chartConfig: this.chartConfig,
            }
        },

        chartConfig() {
            return this.$store.state.chartConfig;
        },

        inboxLink() {
            const defaultLink = '#';

            if (!this.mailId) return defaultLink;

            let link;
            let provider;

            try {
                provider = this.mailId.split('@')[1].split('.')[0];
                link = inboxProviderMap[provider];
            } catch (e) {
                link = defaultLink;
            }

            return link;
        },

        errorMessage() {
            if (!this.showErrorMessage) return '';
            return this.errors.first('mailId');
        }
    },

    methods: {
        async reportClickListener(evt) {
            const button = evt.currentTarget;
            const icon = button.querySelector('i.icn');
            const downloadIconClass = 'icn-download';
            const loadingIconClass = 'icn-loading';

            button.disabled = true;
            icon.classList.replace(downloadIconClass, loadingIconClass);

            await this.multiDashboard();

            button.disabled = false;
            icon.classList.replace(loadingIconClass, downloadIconClass);
        },

        async multiDashboard() {
            const url = `${baseUrl}/export/multipage`;
            const headerText = this.getHeaderText();
            const chartConfigs = Object.values(this.chartConfig);

            const res = await axios.post(url, {
                headerText,
                chartConfigs,
                filter: this.filter,
            }, {
                responseType: 'blob'
            });

            download(res.data, 'Wealth Management Dashboard with Dynamic Data.pdf', 'application/pdf');
        },

        mailClickListener() {
            this.$modal.show('mail-form');
        },

        validateForm() {
            if (!this.fields.mailId) return false;
            if (this.fields.mailId.valid) return true;
            return false;
        },

        async sendMailClickListener(evt) {
            if (!this.validateForm()) return;

            const form = evt.currentTarget;
            const button = form.querySelector('button.btn');
            const icon = button.querySelector('i.icn');
            const input = this.$el.querySelector('.mail-modal-input');
            const message = this.$el.querySelector('.mail-modal-message');
            const sendIconClass = 'icn-send';
            const loadingIconClass = 'icn-loading';
            const failureMessage = 'Urgh, something went wrong while sending you the email. Try again in sometime.';

            button.disabled = true;
            input.disabled = true;
            this.modalClickToClose = false;
            icon.classList.replace(sendIconClass, loadingIconClass);

            const result = await this.mailDashboard();

            if (result) {
                this.showSuccessScreen = true;
            } else {
                this.resultMessage = failureMessage;
                message.style.visibility = 'visible';

                setTimeout(() => {
                    this.resultMessage = '';
                    message.style.visibility = 'hidden';
                }, 3000);
            }

            icon.classList.replace(loadingIconClass, sendIconClass);

            button.disabled = false;
            input.disabled = false;
            this.modalClickToClose = true;
            this.showErrorMessage = false;
        },

        async mailDashboard() {
            const url = `${baseUrl}/export/mail`;
            const headerText = this.getHeaderText();
            const chartConfigs = Object.values(this.chartConfig);
            const { mailId } = this;

            try {
                const res = await axios.post(url, {
                    mailId,
                    headerText,
                    chartConfigs,
                    filter: this.filter,
                });

                if (res.status === 200) return true;
                return false;
            } catch (e) {
                return false;
            }
        },

        async exportClickListener(evt) {
            const button = evt.currentTarget;
            const icon = button.querySelector('i.icn');
            const downloadIconClass = 'icn-download';
            const loadingIconClass = 'icn-loading';

            button.disabled = true;
            icon.classList.replace(downloadIconClass, loadingIconClass);

            await this.exportDashboard();

            button.disabled = false;
            icon.classList.replace(loadingIconClass, downloadIconClass);
        },

        async exportDashboard() {
            const url = `${baseUrl}/export/singlepage`;
            const headerText = this.getHeaderText();
            const chartConfigs = Object.values(this.chartConfig);

            const res = await axios.post(url, {
                headerText,
                chartConfigs,
            }, {
                responseType: 'blob'
            });

            download(res.data, 'Wealth Dashboard.pdf', 'application/pdf');
        },

        getHeaderText() {
            const measure = this.data.filter.measure;
            const prior = this.data.filter.prior;
            let date = this.data.filter.date;

            if (prior === 'Month') {
                date = moment(date, 'MM-DD-YYYY').format('MMMM YYYY');
            }

            return `${measure} for ${date}`;
        },

        inputBlurListener() {
            this.showErrorMessage = true;
        },

        modalClosedListener() {
            this.mailId = null;
            this.showErrorMessage = false;
            this.showSuccessScreen = false;
        },

        modalCloseClickListener() {
            this.$modal.hide('mail-form');
        },
    },
}
</script>

<style lang="scss">
.export-handle {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 12px 20px;
    background: #686980;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    &-header {
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;

        a {
            color: #b9baff;
            transition: color ease 0.2s;

            &:hover, &:active {
                text-decoration: none;
                color: darken(#b9baff, 4%);
            }
        }
    }

    &-button-wrapper {
        display: flex;
        justify-content: center;
    }

    .icn {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 4px;
        background-size: contain;

        &-big {
            width: 100px;
            height: 100px;
        }

        &-download {
            background-image: url(../../images/icon-download.svg);
        }

        &-send {
            background-image: url(../../images/icon-send.svg);
        }

        &-loading {
            background-image: url(../../images/icon-loading.svg);
        }

        &-done {
            background-image: url(../../images/icon-done.svg);
        }
    }

    &-button {
        padding: 12px 24px;
        display: flex;
        align-items: center;
        background: linear-gradient(90deg, #2CC7C0 0%, #59D99D 100%);
        color: #FFF;
        border: none;
        font-weight: 600;
        font-size: 14px;
        margin-right: 15px;

        &:not(:disabled):not(.disabled):hover,
        &:not(:disabled):not(.disabled):focus {
            background: linear-gradient(90deg,#25a8a2,#3ad28b);
        }

        &:not(:disabled):not(.disabled):active {
            background-color: #239d98;
        }

        &:disabled {
            cursor: default;
        }
    }
}

.mail-modal {
    border: 1px solid rgba(62,57,107,0.13);
    border-radius: 4px;
    background-color: #FFFFFF;
    box-shadow: 0 12px 18px 0 rgba(161,166,181,0.1);

    &-screen {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        padding: 70px 60px;

        .close-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 20px;
            font-size: 40px;
            font-weight: 300;
            line-height: 18px;
            opacity: 0.5;
            cursor: pointer;
        }
    }

    &-header {
        font-size: 26px;
        margin-bottom: 7px;
        text-align: center;
    }

    &-subheader {
        font-size: 16px;
        margin-bottom: 40px;
        text-align: center;
    }

    &-actionbox {
        position: relative;
        display: flex;
        width: 100%;
    }

    &-input {
        padding: 9px 16px;
        font-size: 14px;
        border: 1px solid rgba(62,57,107,0.13);
        border-radius: 4px;
        margin-right: 7px;
        flex: 1 0 auto;
    }

    &-message {
        font-size: 16px;
        visibility: hidden;
        margin-bottom: 30px;
        margin-top: 30px;
        text-align: center;
        color: red;
    }

    &-privacy-message {
        font-size: 12px;
        color: #9f9fb9;
        margin: 0;
    }

    .error-message {
        position: absolute;
        bottom: -18px;
        left: 4px;
        margin: 0;
        font-size: 11px;
        color: red;
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: transform 0.5s;
}

.modal-enter,
.modal-leave-to {
    transform: translateY(-100px);
}

.screen-enter-active,
.screen-leave-active {
    transition: opacity 0.5s;
}

.screen-enter,
.screen-leave-to {
    opacity: 0;
}
</style>
