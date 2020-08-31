export class Foreign {
  constructor(playerId, token, userId, userName) {
    this.domain = 'https://dingshan.jingliangsys.cn:88/foreign'

    const player = document.getElementById(playerId)

    player.innerHTML = `<iframe id="jc-live" src="${this.domain}?token=${token}&userId=${userId}&userName=${userName}" width="100%" height="100%" frameborder="0"></iframe>`

    this.iframe = document.getElementById('jc-live')
  }

  start(userId) {
    this.iframe.contentWindow.postMessage({ start: true, userId }, this.domain)
  }

  stop() {
    this.iframe.contentWindow.postMessage({ stop: true }, this.domain)
  }
}
