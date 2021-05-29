<template>
  <b-modal
    id="feedbackModal"
    title="Feedback"
    size="xl"
    centered
    cancel-disabled
  >
    <div
      class="d-flex flex-column px-2"
      style="max-height: 450px; overflow-y: auto"
    >
      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>Do you think this extension is
          useful?</label
        >
        <select
          v-model="feedback.isThisExtensionUseful"
          class="mb-2 form-control"
        >
          <option :value="null"></option>
          <option :value="false">No</option>
          <option :value="true">Yes</option>
        </select>
        <template v-if="$v.feedback.isThisExtensionUseful.$error">
          <div class="error form-text">Required.</div>
        </template>
      </div>

      <template v-if="feedback.isThisExtensionUseful === false">
        <div class="form-group control-label">
          <label for="firstame" class="form-label"
            ><span class="required-symbol">*</span>Could you explain why do you
            think it is not useful?</label
          >
          <textarea
            v-model="$v.feedback.isThisExtensionUsefulJustification.$model"
            rows="3"
            class="form-control"
            style="resize: none; width: 100%"
          ></textarea>
          <template
            v-if="$v.feedback.isThisExtensionUsefulJustification.$error"
          >
            <div class="error form-text">Required.</div>
          </template>
        </div>
      </template>

      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>Does it help you to be more
          productive?</label
        >
        <select
          v-model="feedback.doesItHelpYouToBeMoreProductive"
          class="mb-2 form-control"
        >
          <option :value="null"></option>
          <option :value="false">No</option>
          <option :value="true">Yes</option>
        </select>
        <template v-if="$v.feedback.doesItHelpYouToBeMoreProductive.$error">
          <div class="error form-text">Required.</div>
        </template>
      </div>

      <template v-if="feedback.doesItHelpYouToBeMoreProductive === false">
        <div class="form-group control-label">
          <label for="firstame" class="form-label"
            ><span class="required-symbol">*</span>Could you explain why it does
            not make you more productive? This way I can rethink about this
            product.</label
          >
          <textarea
            v-model="
              $v.feedback.doesItHelpYouToBeMoreProductiveJustification.$model
            "
            rows="3"
            class="form-control"
            style="resize: none; width: 100%"
          ></textarea>
          <template
            v-if="
              $v.feedback.doesItHelpYouToBeMoreProductiveJustification.$error
            "
          >
            <div class="error form-text">Required.</div>
          </template>
        </div>
      </template>

      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>How good do you think this
          extension is? (0 - Really Bad / 5 - Excellent)</label
        >
        <star-rating
          v-model="feedback.howGoodDoYouThinkThisExtensionIs"
          :increment="0.5"
          :star-size="25"
          :show-rating="false"
          class="mb-2"
        ></star-rating>
        <template v-if="$v.feedback.howGoodDoYouThinkThisExtensionIs.$error">
          <div class="error form-text">Required.</div>
        </template>
      </div>

      <template
        v-if="
          feedback.howGoodDoYouThinkThisExtensionIs !== null &&
          feedback.howGoodDoYouThinkThisExtensionIs <= 2.5
        "
      >
        <div class="form-group control-label">
          <label for="firstame" class="form-label"
            ><span class="required-symbol">*</span>Could you explain the reason
            for this grade?</label
          >
          <textarea
            v-model="
              $v.feedback.howGoodDoYouThinkThisExtensionIsJustification.$model
            "
            rows="3"
            class="form-control"
            style="resize: none; width: 100%"
          ></textarea>
          <template
            v-if="
              $v.feedback.howGoodDoYouThinkThisExtensionIsJustification.$error
            "
          >
            <div class="error form-text">Required.</div>
          </template>
        </div>
      </template>

      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>Do you have any additional
          comments or a feature you would like to see in the next
          release?</label
        >
        <textarea
          v-model="$v.feedback.message.$model"
          rows="3"
          class="form-control"
          style="resize: none; width: 100%"
        ></textarea>
        <template v-if="$v.feedback.message.$error">
          <div class="error form-text">Required.</div>
        </template>
      </div>

      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>Would you like to see a Data
          Loader inside VS Code?</label
        >
        <select
          v-model="feedback.wouldYouLikeToSeeADataLoaderInsideVSCode"
          class="mb-2 form-control"
        >
          <option :value="null"></option>
          <option :value="false">No</option>
          <option :value="true">Yes</option>
        </select>
        <template
          v-if="$v.feedback.wouldYouLikeToSeeADataLoaderInsideVSCode.$error"
        >
          <div class="error form-text">Required.</div>
        </template>
      </div>

      <div class="form-group control-label">
        <label for="firstame" class="form-label"
          ><span class="required-symbol">*</span>What can I do to convince you
          to buy a license to support my work?</label
        >
        <textarea
          v-model="
            $v.feedback.whatCanIDoToConvinceYouToBuyALicenseToSupportMyWork
              .$model
          "
          rows="3"
          class="form-control"
          style="resize: none; width: 100%"
        ></textarea>
        <template
          v-if="
            $v.feedback.whatCanIDoToConvinceYouToBuyALicenseToSupportMyWork
              .$error
          "
        >
          <div class="error form-text">Required.</div>
        </template>
      </div>
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
import { required, requiredIf } from 'vuelidate/lib/validators'
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
        isThisExtensionUseful: null,
        isThisExtensionUsefulJustification: null,
        doesItHelpYouToBeMoreProductive: null,
        doesItHelpYouToBeMoreProductiveJustification: null,
        wouldYouLikeToSeeADataLoaderInsideVSCode: false,
        howGoodDoYouThinkThisExtensionIs: null,
        howGoodDoYouThinkThisExtensionIsJustification: null,
        whatCanIDoToConvinceYouToBuyALicenseToSupportMyWork: null,
      },
      isSubmiting: false,
    }
  },
  validations: {
    feedback: {
      message: {
        required,
      },
      isThisExtensionUseful: {
        required,
      },
      isThisExtensionUsefulJustification: {
        required: requiredIf(function () {
          return this.feedback.isThisExtensionUseful === false
        }),
      },
      doesItHelpYouToBeMoreProductive: {
        required,
      },
      doesItHelpYouToBeMoreProductiveJustification: {
        required: requiredIf(function () {
          return this.feedback.doesItHelpYouToBeMoreProductive === false
        }),
      },
      wouldYouLikeToSeeADataLoaderInsideVSCode: {
        required,
      },
      howGoodDoYouThinkThisExtensionIs: {
        required,
      },
      howGoodDoYouThinkThisExtensionIsJustification: {
        required: requiredIf(function (val) {
          return val <= 2.5
        }),
      },
      whatCanIDoToConvinceYouToBuyALicenseToSupportMyWork: {
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
            `${process.env.AWS_GATEWAY_API}/feedback`,
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
  height: 30px;
}
</style>
