<template>
  <div class="d-flex flex-column vw-100 vh-100">
    <div class="m-auto">
      <p>
        Hi, I hope you are doing well. I'm writting this message to ask for your
        help. I just left my job due to the lack of challenges and I don't have
        any opportunities ahead. So, could you share my
        <a href="https://www.linkedin.com/in/allanoricil/">Linkedin</a> profile
        with the internal recruiter of your Company or in your linkedin feed?
        I'm looking for remote opportunities in the UK, Ireland, or in North
        America to work with Salesforce and Cloud services, such as AWS. I'm a
        Full Stack Software Engineer/Salesforce Developer and I can start right
        away.
      </p>
      <br />
      <p>Thanks for your attention and have a good day.</p>
      <br />
      <p>Allan Oricil</p>
      <p>allanoricilcos@outlook.com</p>
      <p>+353 0831724277</p>
      <button class="vscode-button w-100" @click="onClickGoToEditorButton">
        Go to Editor
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      intervalId: null,
    }
  },
  methods: {
    onClickGoToEditorButton() {
      this.$router.push({ name: 'editor' })
    },
  },
}
</script>

<style scoped>
div {
  text-align: justify;
  font-size: 20px;
}

div p {
  width: 500px;
}
</style>
