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

const testBtn = document.querySelector('.test-notification-button')
testBtn.addEventListener('click', () => {
  sendPushNotification()
  console.log('test')
})
