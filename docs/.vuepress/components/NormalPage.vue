<template>
  <NormalPage>
    <template #contentAfter>
      <!-- Only show this on the Home page-->
      <div class="theme-hope-content" v-if="pagePath === '/'">
        <h3>Quickstart</h3>
        <nav class="vp-page-nav">
          <router-link aria-label="Run AI Inference on Nosana" class="vp-link nav-link next nav-link next"
            to="/inference/quick_start.html">
            <div class="hint">Next<span class="arrow end"></span></div>
            <div class="link">Run AI Inference on Nosana</div>
          </router-link>
          <router-link aria-label="Get Started as a GPU Host" class="vp-link nav-link next nav-link next"
            to="/hosts/grid.html">
            <div class="hint">Next<span class="arrow end"></span></div>
            <div class="link">Get Started as a GPU Host</div>
          </router-link>
        </nav>
      </div>
    </template>
  </NormalPage>
</template>
<script setup lang="ts">
import NormalPage from 'vuepress-theme-hope/components/NormalPage.js';
import { usePageData } from '@vuepress/client';
import { ref } from 'vue';
const pagePath = ref(usePageData().value.path);
console.log('pageData', usePageData().value);
</script>
