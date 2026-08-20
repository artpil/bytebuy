<template>
  <component
    :is="tag"
    :class="[
      'v-button',
      `v-button--${variant}`,
      `v-button--${size}`,
      {
        'v-button--full': full,
        'v-button--disabled': disabled,
        'v-button--with-icon': iconLeft || iconRight || $slots['icon-left'] || $slots['icon-right']
      }
    ]"
    :href="tag === 'a' ? to : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="disabled"
    :type="tag === 'button' ? type : undefined"
  >
    <span v-if="iconLeft" class="v-button-icon v-button-icon--left">
      <slot name="icon-left">{{ iconLeft }}</slot>
    </span>
    <span class="v-button-text">
      <slot />
    </span>
    <span v-if="iconRight" class="v-button-icon v-button-icon--right">
      <slot name="icon-right">{{ iconRight }}</slot>
    </span>
  </component>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a', 'router-link'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'link', 'success', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  to: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'button'
  },
  full: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconLeft: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ ===== */
.v-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: inherit;
  line-height: 1;
  outline: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

/* ===== ВАРИАНТЫ ===== */

/* Primary — оранжевый градиент (как .btn-orange) */
.v-button--primary {
  background: linear-gradient(120deg, #F2660D, #D9540A);
  color: white;
  box-shadow: 0 8px 18px -6px rgba(242, 102, 13, 0.55);
}

.v-button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -6px rgba(242, 102, 13, 0.6);
}

.v-button--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px -4px rgba(242, 102, 13, 0.4);
}

/* Secondary — светлый (как кнопки в карточках) */
.v-button--secondary {
  background: #EAF7F2;
  color: #2C4A5E;
}

.v-button--secondary:hover:not(:disabled) {
  background: #DCF2EA;
  transform: translateY(-2px);
}

/* Outline — прозрачная с обводкой */
.v-button--outline {
  background: transparent;
  color: #2C4A5E;
  border: 2px solid #D8ECE5;
}

.v-button--outline:hover:not(:disabled) {
  border-color: #2ECC91;
  color: #2ECC91;
  transform: translateY(-2px);
}

/* Link — как .cta-link (без обводки, с подчеркиванием при ховере) */
.v-button--link {
  background: transparent;
  color: #2C4A5E;
  padding: 0;
  border-radius: 0;
  font-weight: 700;
  font-size: 14px;
  gap: 6px;
}

.v-button--link:hover:not(:disabled) {
  color: #2ECC91;
}

.v-button--link .v-button-text {
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}

.v-button--link:hover .v-button-text {
  border-bottom-color: #2ECC91;
}

/* Success — для успешных действий */
.v-button--success {
  background: linear-gradient(120deg, #2ECC91, #17A9B0);
  color: white;
  box-shadow: 0 8px 18px -6px rgba(46, 204, 145, 0.55);
}

.v-button--success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -6px rgba(46, 204, 145, 0.6);
}

/* Danger — для опасных действий */
.v-button--danger {
  background: #f44336;
  color: white;
}

.v-button--danger:hover:not(:disabled) {
  background: #d32f2f;
  transform: translateY(-2px);
}

/* ===== РАЗМЕРЫ ===== */
.v-button--small {
  padding: 6px 16px;
  font-size: 12px;
  border-radius: 8px;
}

.v-button--medium {
  padding: 10px 22px;
  font-size: 14px;
}

.v-button--large {
  padding: 14px 30px;
  font-size: 15px;
}

/* ===== ПОЛНАЯ ШИРИНА ===== */
.v-button--full {
  width: 100%;
  justify-content: center;
}

/* ===== ОТКЛЮЧЁННЫЙ ===== */
.v-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ===== ИКОНКИ ===== */
.v-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  flex-shrink: 0;
}

.v-button--with-icon .v-button-text {
  margin: 0 2px;
}

/* ===== АДАПТАЦИЯ ===== */
@media (max-width: 768px) {
  .v-button--large {
    padding: 12px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .v-button--large {
    padding: 10px 20px;
    font-size: 13px;
  }

  .v-button--medium {
    padding: 8px 16px;
    font-size: 13px;
  }

  .v-button--link {
    font-size: 13px;
  }
}
</style>
