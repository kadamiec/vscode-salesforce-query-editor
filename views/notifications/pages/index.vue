<template>
  <div class="d-flex flex-column vh-100 vw-100 p-3">
    <p class="title mb-1">Release Notes</p>
    <p class="subtitle">v1.6.0</p>
    <ul>
      <li>
        Add "Notifications View" to alert users about new features or bugs.
      </li>
      <li>
        Change contribution command to "SFDX: Open Salesforce Query Editor"
      </li>
    </ul>

    <p class="title mb-1">Bugs</p>
    <div class="d-flex flex-column px-2">
      <p class="subtitle">
        <a href="https://github.com/AllanOricil/SOQL-Editor-Issues/issues/19"
          >- Extension does not work on VS Code v1.56.X</a
        >
      </p>
      <p class="subtitle px-2">Solution:</p>
      <p class="px-2">
        Downgrade your VS Code to v1.55.2. You can download it using this link:
        <a href="https://code.visualstudio.com/updates/v1_55"
          >https://code.visualstudio.com/updates/v1_55</a
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
