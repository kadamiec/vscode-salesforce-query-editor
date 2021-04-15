<template>
  <b-modal
    id="feedbackModal"
    title="Feedback"
    size="xl"
    centered
    cancel-disabled
  >
    <div class="d-flex flex-column">
      <span>Do you think this extension is useful?</span>
      <select v-model="feedback.isThisExtensionUseful" class="mb-2">
        <option :value="false">No</option>
        <option :value="true">Yes</option>
      </select>
      <span>Does it help you to be more productive?</span>
      <select v-model="feedback.doesItHelpYouToBeMoreProductive" class="mb-2">
        <option :value="false">No</option>
        <option :value="true">Yes</option>
      </select>
      <span>Would you like to see a Data Loader inside VS Code?</span>
      <select
        v-model="feedback.wouldYouLikeToSeeADataLoaderInsideVSCode"
        class="mb-2"
      >
        <option :value="false">No</option>
        <option :value="true">Yes</option>
      </select>
      <span>How likely are you to recommend this extension to someone?</span>
      <star-rating
        v-model="feedback.wouldYouRecommendThisExtension"
        :increment="0.5"
        :star-size="25"
        :show-rating="false"
        class="mb-2"
      ></star-rating>
      <span
        >Do you have any additional comments or a feature you would like to see
        in the next release?</span
      >
      <textarea
        v-model="$v.feedback.message.$model"
        rows="10"
        style="resize: none; width: 100%"
      ></textarea>
      <template v-if="$v.feedback.message.$error">
        <div class="error form-text">Message is required.</div>
      </template>
    </div>
    <template #modal-header="{ close }">
      <div
        class="d-flex w-100 justify-content-between"
        style="color: var(--vscode-input-foreground)"
      >
        <span style="font-size: 15px">Feedback</span>
        <i class="fa fa-close fa-lg" @click="close()"></i>
      </div>
    </template>
    <template #modal-footer="{ close }">
      <button
        type="button"
        class="vscode-button-md"
        :disabled="isSubmiting"
        @click="onClickSaveReview()"
      >
        Save
      </button>
      <button
        type="button"
        class="vscode-button-md"
        :disabled="isSubmiting"
        @click="close()"
      >
        Close
      </button>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'
import { required } from 'vuelidate/lib/validators'
import showToastMessage from '~/mixins/show-toast-message'

export default {
  components: {
    StarRating,
  },
  mixins: [showToastMessage],
  data: () => {
    return {
      feedback: {
        message: null,
        isThisExtensionUseful: false,
        doesItHelpYouToBeMoreProductive: false,
        wouldYouLikeToSeeADataLoaderInsideVSCode: false,
        wouldYouRecommendThisExtension: 0,
      },
      isSubmiting: false,
    }
  },
  validations: {
    feedback: {
      message: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
    }),
  },
  methods: {
    open() {
      this.$bvModal.show('feedbackModal')
    },
    onClickSaveReview() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isSubmiting = true
        this.$axios
          .post(
            `${process.env.WEBHOOKS_SERVER}/feedback`,
            {
              userId: this.auth.userId,
              feedback: this.feedback,
            },
            {
              headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
              },
            }
          )
          .then(() => {
            this.showToastMessage('Feedback Received. Thank you!')
          })
          .catch(() => {
            this.showToastMessage('Could not save your feedback.')
          })
          .finally(() => {
            this.isSubmiting = false
            this.$bvModal.hide('feedbackModal')
          })
      }
    },
  },
}
</script>

<style scoped>
select {
  height: 25px;
}
</style>
