<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
::-webkit-scrollbar {
    width: 0.5em;
}

::-webkit-scrollbar-thumb {
    background-color: var(--vscode-scrollbarSlider-background);
    outline: 1px solid slategrey;
}
</style>
