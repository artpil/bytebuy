// fix-base64.js
import fetch from 'node-fetch'

// ===== ВАШИ ДАННЫЕ =====


const CLIENT_ID = 'DJuCOvkovq1xyO7t177wIoS8ePOYb4'
const CLIENT_SECRET = 'CE2zZLZMrdh1mMxw6EHpQMVCNBdzbJ'

// Генерируем правильный base64_header
function generateBase64Header() {
  // Убираем все пробелы и лишние символы
  const cleanClientId = CLIENT_ID.trim()
  const cleanClientSecret = CLIENT_SECRET.trim()

  // Создаем строку для кодирования
  const credentials = `${cleanClientId}:${cleanClientSecret}`

  console.log('📝 Исходные данные для кодирования:')
  console.log(`  client_id: ${cleanClientId}`)
  console.log(`  client_secret: ${cleanClientSecret}`)
  console.log(`  Строка для кодирования: ${credentials}`)

  // Кодируем в base64 (Buffer для Node.js)
  const base64 = Buffer.from(credentials, 'utf-8').toString('base64')

  console.log(`\n✅ Новый base64_header: ${base64}`)
  console.log(`\n📋 Скопируйте это значение в .env файл:`)
  console.log(`VITE_ADMITAD_BASE64=${base64}`)

  return base64
}

// Тестируем новый header
async function testNewHeader() {
  console.log('\n🚀 Тестируем новый base64_header...\n')

  const newBase64 = generateBase64Header()

  try {
    const response = await fetch('https://api.admitad.com/token/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${newBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'common_data',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Ошибка ${response.status}: ${errorText}`)

      if (response.status === 401) {
        console.log('\n⚠️ Проверьте:')
        console.log('  1. Правильно ли указаны client_id и client_secret')
        console.log('  2. Есть ли у вас доступ к API (подтвержден ли email)')
        console.log('  3. Активен ли ваш аккаунт в Admitad')
      }
      return
    }

    const data = await response.json()
    console.log('✅ Успешно! Токен получен:')
    console.log(`  ${data.access_token.substring(0, 30)}...`)
    console.log(`  Истекает через: ${data.expires_in} секунд`)

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  }
}

// Запускаем тест
testNewHeader()
