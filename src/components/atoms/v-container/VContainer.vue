<template>
  <div class="the-container">
    <slot />
  </div>
</template>

<style scoped>
.the-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 12px;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .the-container {
    padding-right: 16px;
    padding-left: 16px;
  }
}

@media (min-width: 1200px) {
  .the-container {
    max-inline-size: 1504px;
    margin-block: 0;
    margin-inline: auto;
    padding-block: 0;
    padding-inline: 32px;
  }
}

</style>
