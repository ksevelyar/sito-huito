// ==UserScript==
// @author  ksevelyar
// @name    dat_filter_tinder
// @grant   none
// @include https://tinder.com/app/recs
// ==/UserScript==

const positiveChecks = {
  dev(desc) {
    return [
      'elixir', 'phoenix', 'javascript', ' vue ', ' rust', ' sql',
      ' git', 'github', 'programm', 'developer', 'machine learning'
    ].some(string => desc.includes(string))
  },
  devops(desc) {
    return ['linux', 'nix', 'k8s', 'bsd'].some(string => desc.includes(string))
  },
  microcontrollers(desc) {
    return ['stm32', 'esp32', 'attiny', 'arduino', ' iot '].some(string => desc.includes(string))
  },
  printer(desc) {
    return ['3d-print', ' ender'].some(string => desc.includes(string))
  },
  atheism(desc) {
    return desc.includes('atheis')
  },
  chill(desc) {
    return ['420', '4:20', '🍄'].some(string => desc.includes(string))
  },
  books(desc) {
    return [
      'blindsight', 'sapolsky', 'dawkins', 'catch-22', 'град обреченный'
    ].some(string => desc.includes(string))
  },
  games(desc) {
    return [
      'fallout', 'quake', 'dungeon keeper', 'deus ex', 'morrowind',
      'system shock', 'baldur\'s gate', 'vice city', 'grim fandango'
    ].some(string => desc.includes(string))
  }
}

const negativeChecks = {
  magicalThinker(desc) {
    return [
      '♈', '♉', '♊', '♋', '♌', '♍', '♏️', '🦂', '♎', '♐', '♑', '♒', '♓',
      'козерог', 'водолей', 'овен', 'телец', 'дева', 'весы', 'скорпион', 'стрелец',
      'православ', 'christian',
      'astrolog', 'астролог', 'эзотерик'
    ].some(string => desc.includes(string))
  },
  emptyProfile(desc) {
    return desc.length < 2 ||
      desc.includes('kilometers away') || desc.includes('lives in') ||
      desc.length < 30 && (desc.includes('@') || desc.includes('inst') || desc.includes('инст') ) ||
      desc.length < 20 && /\d{3}/.test(desc)
  },
  sexTrafficking(desc) {
    return [
      'не скупого', 'папик', 'ищу спонсора', 'интим',
      'не жадного', 'ищу щедрого', 'щедрый',
    ].some(string => desc.includes(string))
  },
  fraud(desc) {
    return [
      'вирт ', 'модель ню', 'приветик', 'в театр',
      'здесь редко', 'здесь не сижу', 'тут не сижу', 'тут бываю редко',
      'пишите в ', 'пиши в ', 'буду ждать тебя в', 'напиши мне в '
    ].some(string => desc.includes(string))
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
      'мужа', 'женат', 'жених', 'замуж',
      'леди', 'принц', 'забери меня', '❌', '❗️', 'футбол', 'караоке'
    ].some(string => desc.includes(string))
  },
  heightFilter(desc) {
    const h17x = desc.match(/17(\d)/)
    const isHigherThan174 = (h17x && h17x[1] && h17x[1] > 4)

    return /18\d/.test(desc) || /19\d/.test(desc) || isHigherThan174
  },
}

const actions = {
  nope(reason, description) {
    console.log(`[NOPE: ${reason}]`, description)
    const dislikeButton = document.querySelectorAll('.button')[1]
    if (!dislikeButton) { return console.log('🤖 Dislike button not found') }

    dislikeButton.click()
    setTimeout(filter.call, 1000)
  },
  yes(reason, description) {
    console.log(`[YES: ${reason}]`, description)
    const likeButton = document.querySelectorAll('.button')[3]
    if (!likeButton) { return console.log('🤖 Like button not found') }

    likeButton.click()
    setTimeout(filter.call, 1000)
  }
}

const filter = {
  delay(extraDelay = 0) {
    return Math.ceil(Math.random() * 1000 + 500 + extraDelay)
  },
  fetchDescription() {
    const descriptionVariant0 = "[aria-hidden='false'] .BreakWord"
    const descriptionNode = document.querySelector(descriptionVariant0)

    if (descriptionNode) {
      return descriptionNode.innerText
    }

    return ''
  },
  call() {
    const noThanks = Array.from(document.querySelectorAll('.button span')).find(
      button => button.innerText == 'NO THANKS'
    )
    if (noThanks) { window.location.reload() }

    const rawDescription = filter.fetchDescription()
    const desc = rawDescription.toLowerCase()

    const coolStuff = Object.keys(positiveChecks).find(positiveCheck => positiveChecks[positiveCheck](desc))
    if (coolStuff) { return actions.yes(coolStuff, rawDescription) }

    const dealbreaker = Object.keys(negativeChecks).find(negativeCheck => negativeChecks[negativeCheck](desc))
    if (dealbreaker) { return actions.nope(dealbreaker, rawDescription) }

    console.log(`🤖 Your turn human, swipe or improve me\n\n${rawDescription}\n`)
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
