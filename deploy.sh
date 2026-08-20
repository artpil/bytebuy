#!/usr/bin/env bash
set -e

# ===== НАСТРОЙКИ =====
SOURCE_DIR="$(pwd)"             # папка 1 — D:\wamp\www\ecnal\myprj\bytebuy (запускать скрипт отсюда)
DEPLOY_DIR="../bytebuy.git"     # папка 2 — D:\wamp\www\ecnal\myprj\bytebuy.git (соседняя папка)

echo "📥 1/4 — Обновляю products.json из фидов Admitad..."
node scripts/fetch-feeds.mjs

echo ""
echo "🏗️  2/5 — Собираю проект (vite build)..."
npm run build

echo ""
echo "📄 3/5 — Пререндер страниц товаров (SEO/OG-теги)..."
node scripts/prerender.mjs

echo ""
echo "📦 4/5 — Копирую dist в $DEPLOY_DIR..."
if command -v rsync >/dev/null 2>&1; then
  # Есть rsync — синхронизируем с удалением старых файлов, .git не трогаем
  rsync -a --delete --exclude='.git' "$SOURCE_DIR/dist/" "$DEPLOY_DIR/"
elif command -v robocopy >/dev/null 2>&1; then
  # Windows без rsync (обычный Git Bash) — используем robocopy.
  # MSYS_NO_PATHCONV=1 обязателен: иначе Git Bash подменяет /MIR, /XD и т.д.
  # на несуществующие Windows-пути (типа "C:/Program Files/Git/MIR").
  #
  # ВАЖНО: robocopy возвращает ненулевые коды 1-7 даже при УСПЕШНОМ копировании
  # (это его штатное поведение, битовая маска событий, а не ошибка). Поскольку
  # в начале скрипта стоит `set -e`, любой ненулевой код тут же убивал бы весь
  # скрипт молча, до того как мы успевали проверить реальный код через $?.
  # Поэтому временно отключаем set -e именно вокруг этого вызова.
  set +e
  MSYS_NO_PATHCONV=1 robocopy "$(cygpath -w "$SOURCE_DIR/dist")" "$(cygpath -w "$DEPLOY_DIR")" /MIR /XD .git /NFL /NDL /NJH /NJS
  rc=$?
  set -e

  if [ $rc -ge 8 ]; then
    echo "❌ robocopy завершился с ошибкой (код $rc)"
    exit 1
  fi
else
  echo "❌ Не найден ни rsync, ни robocopy. Установите rsync через 'pacman -S rsync' (Git Bash/MSYS2) или скопируйте dist вручную."
  exit 1
fi

echo ""
echo "🚀 5/5 — Коммичу и пушу..."
cd "$DEPLOY_DIR"
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || { echo "Нечего коммитить, изменений нет"; exit 0; }
git push

echo ""
echo "✅ Готово! Сайт обновлён."