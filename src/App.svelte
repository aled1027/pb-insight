<script lang="ts">
  import { onMount } from "svelte";
  import { theme, initializeTheme } from "./lib/stores/theme";
  import MainContent from "./lib/components/MainContent.svelte";

  onMount(() => {
    initializeTheme();
  });
</script>

<div class="h-screen bg-base-200" data-theme={$theme}>
  <main class="pt-8 px-4">
    <MainContent />
  </main>
</div>
