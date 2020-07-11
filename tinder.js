// ==UserScript==
// @name         dat_filter_tinder
// @version      0.3
// @description  sito huito
// @author       ksevelyar
// @grant        none
// @include https://tinder.com/app/recs
// ==/UserScript==

let $ = selector => document.querySelector(selector)
let $all = selector => document.querySelectorAll(selector)

const page = {
  contains(selector, text) {
    const elements = $all(selector)
    return Array.prototype.filter.call(elements, element => RegExp(text).test(element.textContent))
  },
  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  }
}

const actions = {
  nope(reason, description) {
    const dislikeButton = $('[aria-label="Nope"]')
    if (!dislikeButton) {return }

    console.log(`[NOPE: ${reason}]`, description)
    dislikeButton.click()
  },

  yes(description) {
    const superLikeButton = $('[aria-label="Super Like"]')
    const likeButton = $('[aria-label="Like"]') || $('[aria-label="Лайк"]')
    if (!likeButton) {return }

    console.log('[YES]', description)
    actions._isSuperlikesAvailable() ? superLikeButton.click() : likeButton.click()
  }
}

const filter = {
  delay() {
    return Math.ceil(Math.random() * 1000 + 4000)
  },
  hidePopups() {
    const NotInterestedButton = page.contains('button span', 'Not interested')[0]
    if (NotInterestedButton) {NotInterestedButton.click()}
  },

  call() {
    filter.hidePopups()
    const descriptionNode = page.getElementByXpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[6]/div/div[2]/div/div')
    if (!descriptionNode) {return }

    const description = descriptionNode.innerText
    console.log(`\n${description}\n`)
    const d = description.toLowerCase()

    if (
      d.includes("есть сын") ||
      d.includes("есть дочь") ||
      d.includes("есть дочка") ||
      d.includes("есть ребенок")
    ) {actions.nope('kids', description); return }

    if (
      d.includes("♈") ||
      d.includes("♉") ||
      d.includes("♊") ||
      d.includes("♋") ||
      d.includes("♌") ||
      d.includes("♍") ||
      d.includes("♎") ||
      d.includes("♐") ||
      d.includes("♑") ||
      d.includes("♒") ||
      d.includes("♓")
    ) {actions.nope('magical thinker', description); return }

    if (
      d.includes("не скупого") ||
      d.includes("ищу папика") ||
      d.includes("ищу щедрого") ||
      d.includes("не жадного")
    ) {actions.nope('🦆', description); return }

    if (
      d.includes("отнош") ||
      d.includes("serious relationship")
    ) {actions.nope('why so serious?', description); return }

    if (
      d.includes("мужчина") ||
      d.includes("женщина")
    ) {actions.nope('gender roles', description); return }

    if (
      d.includes("мужа")
    ) {actions.nope('💨', description); return }

    if (
      d.includes("программист") ||
      d.includes("programmer") ||
      d.includes("github") ||
      d.includes("linux")
    ) {
      actions.yes(description)
    }
  }
}

window.addEventListener('load', () => setTimeout(filter.call, 5000), false)
document.addEventListener('keyup', (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    setTimeout(filter.call, 1500)
  }
})
