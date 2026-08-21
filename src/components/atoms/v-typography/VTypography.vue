<template>
  <component
          :is="tag"
          :class="[
      'v-typography',
      `v-typography--${variant}`,
      `v-typography--${align}`,
      {
        'v-typography--primary': color === 'primary',
        'v-typography--secondary': color === 'secondary',
        'v-typography--muted': color === 'muted',
        'v-typography--white': color === 'white',
        'v-typography--success': color === 'success',
        'v-typography--bold': weight === 'bold',
        'v-typography--medium': weight === 'medium',
        'v-typography--light': weight === 'light',
        'v-typography--uppercase': transform === 'uppercase',
        'v-typography--lowercase': transform === 'lowercase',
        'v-typography--capitalize': transform === 'capitalize',
        'v-typography--ellipsis': ellipsis,
        'v-typography--nowrap': nowrap,
      }
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  /**
   * HTML-тег компонента
   * @values 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label'
   */
  tag: {
    type: String,
    default: 'p'
  },
  /**
   * Вариант отображения (стиль)
   * @values 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline', 'button'
   */
  variant: {
    type: String,
    default: 'body1'
  },
  /**
   * Выравнивание текста
   * @values 'left', 'center', 'right', 'justify'
   */
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },
  /**
   * Цвет текста
   * @values 'primary', 'secondary', 'muted', 'white', 'success'
   */
  color: {
    type: String,
    default: 'primary'
  },
  /**
   * Жирность шрифта
   * @values 'bold', 'medium', 'light'
   */
  weight: {
    type: String,
    default: null,
    validator: (value) => ['bold', 'medium', 'light'].includes(value)
  },
  /**
   * Трансформация текста
   * @values 'uppercase', 'lowercase', 'capitalize'
   */
  transform: {
    type: String,
    default: null,
    validator: (value) => ['uppercase', 'lowercase', 'capitalize'].includes(value)
  },
  /**
   * Обрезать текст с троеточием (одна строка)
   */
  ellipsis: {
    type: Boolean,
    default: false
  },
  /**
   * Запретить перенос строк
   */
  nowrap: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* ===== БАЗОВЫЕ СТИЛИ ===== */
.v-typography {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

/* ===== ВАРИАНТЫ (VARIANTS) ===== */
/* Заголовки */
.v-typography--h1 {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.2;
}

.v-typography--h2 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.25;
}

.v-typography--h3 {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}

.v-typography--h4 {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.35;
}

.v-typography--h5 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.v-typography--h6 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

/* Основные тексты */
.v-typography--body1 {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}

.v-typography--body2 {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

/* Вспомогательные */
.v-typography--caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #4a4a6a;
}

.v-typography--overline {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4a4a6a;
}

.v-typography--button {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  display: inline-block;
}

/* ===== ЦВЕТА ===== */
.v-typography--primary {
  color: #1a1a2e;
}

.v-typography--secondary {
  color: #4a4a6a;
}

.v-typography--muted {
  color: #8a8aa0;
}

.v-typography--white {
  color: #ffffff;
}

.v-typography--success {
  color: #4CAF50;
}

/* ===== ВЫРАВНИВАНИЕ ===== */
.v-typography--left {
  text-align: left;
}

.v-typography--center {
  text-align: center;
}

.v-typography--right {
  text-align: right;
}

.v-typography--justify {
  text-align: justify;
}

/* ===== ЖИРНОСТЬ ===== */
.v-typography--bold {
  font-weight: 700;
}

.v-typography--medium {
  font-weight: 500;
}

.v-typography--light {
  font-weight: 300;
}

/* ===== ТРАНСФОРМАЦИЯ ===== */
.v-typography--uppercase {
  text-transform: uppercase;
}

.v-typography--lowercase {
  text-transform: lowercase;
}

.v-typography--capitalize {
  text-transform: capitalize;
}

/* ===== СПЕЦИАЛЬНЫЕ ===== */
.v-typography--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-typography--nowrap {
  white-space: nowrap;
}

/* ===== АДАПТАЦИЯ ===== */
@media (max-width: 768px) {
  .v-typography--h1 {
    font-size: 32px;
  }

  .v-typography--h2 {
    font-size: 28px;
  }

  .v-typography--h3 {
    font-size: 24px;
  }

  .v-typography--h4 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .v-typography--h1 {
    font-size: 26px;
  }

  .v-typography--h2 {
    font-size: 22px;
  }

  .v-typography--h3 {
    font-size: 20px;
  }
}
</style>