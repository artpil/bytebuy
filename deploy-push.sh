#!/usr/bin/env bash
set -e

# ===== НАСТРОЙКИ =====
SOURCE_DIR="$(pwd)"                     # папка 1 — D:\wamp\www\ecnal\myprj\bytebuy (запускать скрипт отсюда)
DEPLOY_DIR="../bytebuy.git"             # папка 2 — D:\wamp\www\ecnal\myprj\bytebuy.git (соседняя папка)

echo "📦 1/2 — Копирую исходники в $DEPLOY_DIR..."

if command -v rsync >/dev/null 2>&1; then
  # Есть rsync — синхронизируем с удалением старых файлов, .git и node_modules не трогаем
  rsync -a --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.vite' \
    --exclude='*.log' \
    --exclude='.env' \
    --exclude='.DS_Store' \
    "$SOURCE_DIR/" "$DEPLOY_DIR/"
elif command -v robocopy >/dev/null 2>&1; then
  # Windows без rsync (обычный Git Bash) — используем robocopy.
  set +e
  MSYS_NO_PATHCONV=1 robocopy \
    "$(cygpath -w "$SOURCE_DIR")" \
    "$(cygpath -w "$DEPLOY_DIR")" \
    /MIR \
    /XD .git node_modules dist .vite \
    /XF *.log .env .DS_Store \
    /NFL /NDL /NJH /NJS
  rc=$?
  set -e

  if [ $rc -ge 8 ]; then
    echo "❌ robocopy завершился с ошибкой (код $rc)"
    exit 1
  fi
else
  echo "❌ Не найден ни rsync, ни robocopy. Установите rsync через 'pacman -S rsync' (Git Bash/MSYS2) или скопируйте вручную."
  exit 1
fi

echo ""
echo "🚀 2/2 — Коммичу и пушу в bytebuy.git..."
cd "$DEPLOY_DIR"
git add -A
git commit -m "update: $(date '+%Y-%m-%d %H:%M')" || { echo "Нечего коммитить, изменений нет"; exit 0; }
git push origin main

echo ""
echo "✅ Готово! Код обновлён в репозитории bytebuy.git."