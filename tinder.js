// ==UserScript==
// @name    dat_filter_tinder
// @grant   none
// @include https://tinder.com/app/recs
// ==/UserScript==

const dislikeButtonXpath =
  '//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[2]/button'
const likeButtonXpath =
  '//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button'
const descriptionVariant0 =
  '//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[3]/div/div[2]/div/div[2]'
const descriptionVariant1 =
  '//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[3]/div/div[2]/div/div'

const positiveChecks = {
  dev(desc) {
    return [
      'elixir', 'phoenix', 'javascript', ' vue ', 'rust', 'sql',
      ' git', 'github', 'programm', ' dev'
    ].some(substring => desc.includes(substring))
  },
  devops(desc) {
    return ['linux', 'nix', 'k8s', 'bsd'].some(substring => {
      desc.includes(substring)
    })
  },
  microcontrollers(desc) {
    return ['stm32', 'esp32', 'attiny', 'arduino'].some(substring => desc.includes(substring))
  },
  science(desc) {
    return [
      'math', 'chemistry',
      'матем', 'хими'
    ].some(substring => desc.includes(substring))
  },
  atheism(desc) {
    return desc.includes('atheis')
  },
  chill(desc) {
    return ['420', '4:20', '🍄'].some(substring => desc.includes(substring))
  },
  books(desc) {
    return ['blindsight', 'sapolsky', 'dawkins', 'catch-22'].some(substring => desc.includes(substring))
  }
}

const negativeChecks = {
  magicalThinker(desc) {
    return [
      '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♐', '♑', '♒', '♓',
      'козерог', 'водолей', 'овен', 'телец', 'дева', 'весы', 'скорпион', 'стрелец', 
      'православ', 'christian',
      'astrolog', 'астролог', 'эзотерик'
    ].some(substring => desc.includes(substring))
  },
  emptyProfile(desc) {
    return desc.length < 2 ||
      desc.includes('kilometers away') || desc.includes('lives in') ||
      desc.length < 30 && (desc.includes('@') || desc.includes('inst') || desc.includes('инст') )
  },
  fraud(desc) {
    return [
      'не скупого',
      'папик',
      'вирт ',
      'ищу спонсора',
      'модель ню',
      'ищу щедрого',
      'щедрый',
      'приветик',
      'не жадного',
      'билет в театр',
      'здесь редко',
      'здесь не сижу',
      'тут не сижу',
      'тут бываю редко'
    ].some(substring => desc.includes(substring))
  },
  kids(desc) {
    return desc.includes('есть сын') ||
      desc.includes('есть дочь') ||
      desc.includes('есть дочка') ||
      desc.includes('есть ребенок') ||
      desc.includes('мама сына')
  },
  'whySoSerious?'(desc) {
    return desc.includes('серь') && desc.includes('отнош') ||
      desc.includes('ищу отношения') ||
      desc.includes('serious relationship')
  },
  genderRoles(desc) {
    return desc.includes('мужчин') || desc.includes('женщин')
  },
  differentGoals(desc) {
    return [
      'любимого', 'ухаживать', 'хочу влюбиться', 'половинку',
      'мужа', 'женат', 'жених',
      'леди'
    ].some(substring => desc.includes(substring))
  }
}

const actions = {
  nope(reason, description) {
    console.log(`[NOPE: ${reason}]`, description)
    const dislikeButton = filter.getElementByXpath(dislikeButtonXpath)
    if (!dislikeButton) { return console.log('🤖 Dislike button not found, update xpath') }

    dislikeButton.click()
    setTimeout(filter.call, 1000)
  },
  yes(reason, description) {
    console.log(`[YES: ${reason}]`, description)
    const likeButton = filter.getElementByXpath(likeButtonXpath)
    if (!likeButton) { return console.log('🤖 Like button not found, update xpath') }

    likeButton.click()
    setTimeout(filter.call, 1000)
  }
}

const filter = {
  delay(extraDelay = 0) {
    return Math.ceil(Math.random() * 1000 + 500 + extraDelay)
  },
  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  },
  fetchDescription() {
    const variant0 = filter.getElementByXpath(descriptionVariant0)
    const variant1 = filter.getElementByXpath(descriptionVariant1)

    const descriptionNode = variant0 || variant1

    if (descriptionNode && Array.from(descriptionNode.classList).includes('BreakWord')) {
      return descriptionNode.innerText
    }

    return ''
  },
  call() {
    const rawDescription = filter.fetchDescription()
    const desc = rawDescription.toLowerCase()

    const coolStuff = Object.keys(positiveChecks).find(positiveCheck => positiveChecks[positiveCheck](desc))
    if (coolStuff) { return actions.yes(coolStuff, rawDescription) }

    const dealbreaker = Object.keys(negativeChecks).find(negativeCheck => negativeChecks[negativeCheck](desc))
    if (dealbreaker) { return actions.nope(dealbreaker, rawDescription) }

    console.log('🤖 Your turn human', `\n\n${rawDescription}\n`)
  }
}

window.addEventListener('load', () => {
  setTimeout(filter.call, filter.delay(5000))
}, false)

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(filter.call, filter.delay())
    clearTimeout(window.reloadTimer)
  }
})
