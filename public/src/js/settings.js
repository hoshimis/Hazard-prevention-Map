// TODO:push通知の状態を保持する

// 各ボタン要素の取得
const testBtn = document.querySelector('.test-notification-button')
const saveOpenDataColorBtn = document.querySelector('.setOpenDataColor-button')
const saveUserDataColorBtn = document.querySelector('.setUserDataColor-button')
const savePushCheck = document.querySelector('#inputPush')

// colorPicker要素の取得
const inputOpenDataColor = document.querySelector('#openDataCircleColor')
const inputUserDataColor = document.querySelector('#userDataCircleColor')

// windowロード時に行う
document.addEventListener('DOMContentLoaded', () => {
  const openDataColor = getStorage('openDataColor')
  const userDataColor = getStorage('userDataColor')
  const pushCheck = getStorage('pushCheck')

  openDataColor !== undefined
    ? (inputOpenDataColor.value = openDataColor)
    : (inputOpenDataColor.value = '#000')

  userDataColor !== undefined
    ? (inputUserDataColor.value = userDataColor)
    : (inputUserDataColor.value = '#000')

  pushCheck !== undefined
    ? (savePushCheck.checked = pushCheck)
    : (savePushCheck.checked = true)
})

// ローカルストレージへの保存
saveOpenDataColorBtn.addEventListener('click', () => {
  const color = inputOpenDataColor.value
  saveStorage('openDataColor', color)
})
saveUserDataColorBtn.addEventListener('click', () => {
  const color = inputUserDataColor.value
  saveStorage('userDataColor', color)
})
savePushCheck.addEventListener('change', () => {
  const check = savePushCheck.checkd
  saveStorage('pushCheck', check)
})

// testボタンが押されたらプッシュ通知を行う
testBtn.addEventListener('click', () => {
  sendPushNotification()
  console.log('test')
})

/**
 * ローカルストレージへの読み書き
 * @see https://blog.codecamp.jp/localstorage-web-data
 */
const saveStorage = (name, value) => {
  localStorage.setItem(name, value)
}
const getStorage = (name) => {
  const getItem = localStorage.getItem(name)
  return getItem
}

/**
 * push通知を送る
 * @see
 */
const sendPushNotification = () => {
  Push.create('危険予防マップ', {
    body: '危険な区域に近づきました。周りに注意してください。',
    icon: '../images/sample.png',
    timeout: 5000,
    onClick: () => {
      this.close()
      location.href = '/'
    }
  })
}
