'use strict'

const MAIN = document.querySelector('#main')
const HEADER = document.querySelector('#header')
const MUSIC_BTN = document.querySelector('#musicBtn')
const SEARCH = document.querySelector('.search')
const SEARCH_HINT = document.querySelector('.search__hint')
const RESET = document.querySelector('.resetBtn')
const FILTER = document.querySelector('.filterBtn')
const SEARCH_INPUT = document.querySelector('#icon_prefix')
const GENDER_RADIO = document.querySelectorAll('.nav__radioGender')
const RANGE_SLIDER = document.getElementById('test-slider')
const SORT_RADIO = document.querySelectorAll('.nav__sort')
const MAX_AGE_HINT = document.querySelectorAll('.maxAge')
const MIN_AGE_HINT = document.querySelectorAll('.minAge')

const API_LINK = 'https://randomuser.me/api/'

const APP_LONG_DELAY = 3000
const APP_DELAY = 1000
const FRIENDS_MIN = 30
const FRIENDS_MAX = 50

//noUiSlider
const RANGE_SLIDER_MIN_VALUE = 20
const RANGE_SLIDER_MAX_VALUE = 80
const SLIDER_SETTINGS = {
    start: [RANGE_SLIDER_MIN_VALUE, RANGE_SLIDER_MAX_VALUE],
    connect: true,
    step: 1,
    orientation: 'horizontal',
    range: {
        'min': 0,
        'max': 100
    },
    format: wNumb({
        decimals: 0
    })
}

//Classes by AnimateCSS (default speed of 1s)
const SHOW_ELEM_PRIMARY_ANIMATION = 'animate__zoomIn'
const HIDE_ELEM_PRIMARY_ANIMATION = 'animate__zoomOut'
const SHOW_ELEM_SECONDARY_ANIMATION = 'animate__fadeIn'
const HIDE_ELEM_SECONDARY_ANIMATION = 'animate__fadeOut'
const ANIMATION_SPEED = 'animate__faster' //500ms

const ERROR_MESSAGE = 'Something went wrong, we are so sorry: (Please, reload the page!'
const GREETING_CONTENT = ` <h4>Wow!!!</h4>
                        <h4 class="greeting__text" > We found so many people, who want to meet YOU!!!</h4>
                        <a id="startBtn" class="waves-effect waves-light btn-large hoverable startBtn">
                            <i class="material-icons right">announcement</i>
                            Show me them all!
                        </a>`

const APP_AUDIO = new Audio('./audio/you_ve_got_a_friend_in_me.mp3')
APP_AUDIO.loop = true
APP_AUDIO.volume = 0.3

let FRIENDS_SOURCE = []
let CURRENT_FRIENDS = []
let isMusicStopedByUser = false


initApp()


function initApp() {
    getFriends(getRandomIntInclusive(FRIENDS_MIN, FRIENDS_MAX))
    addListeners()
    createRangeSlider()
}

function getFriends(num) {
    fetch(`${API_LINK}?results=${num}`)
        .then(function(resp) {
            return resp.json()
        }).then(function(data) {
            for (let index = 0; index < data.results.length; index++) {
                FRIENDS_SOURCE = data.results
            }
        }).then(function() {
            const timeout = setTimeout(() => {
                changeContent(createStartScreen(), SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
                clearTimeout(timeout)
            }, APP_LONG_DELAY)
        })
        .catch(function(error) {
            console.log(error.message)
            changeContent(`<h1 class="container h-100 flexContainerCol errorMes">${ERROR_MESSAGE}</h1>`, SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
        })
}

function addListeners() {
    document.addEventListener('DOMContentLoaded', activateSideNav)
    FILTER.addEventListener('click', filter)
    RESET.addEventListener('click', resetFilter)
    MAIN.addEventListener('click', function({ target }) {
        if (target.classList.contains('startBtn')) {
            changeContent(createFriendsScreen(FRIENDS_SOURCE), SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
            showSearchBar()
            playMusic()
        }
    })
}

function createStartScreen() {
    const greeting = `<div class="container greeting__container flexContainerCol">${GREETING_CONTENT}</div>`
    return greeting
}

function createFriendsScreen(array) {
    let friends = '<div class="container friends__container"><div class="flexContainerRow">'
    for (const friend of array) {
        const genderStyle = (friend.gender === 'male') ? 'card__title-male' : 'card__title-female'
        const card = `<div class="card">
                            <div class="card-image">
                                <img class="card__img" src="${friend.picture.large}" alt="person photo">
                                <span class="card-title card__title ${genderStyle}">${friend.name.first} ${friend.name.last}</span>
                            </div>
                            <div class="card-content card__content">
                                <p>Hi, I am <span class="card__contentData">${friend.dob.age}</span> years old and I live in <span class="card__contentData">${friend.location.city}, ${friend.location.country}</span>.</p>
                                <p>Call me, I want to be your friend.</p>
                                <a href="${friend.phone}" class="card__contentData">${friend.phone}</a>
                            </div>
                                <div class="card-action">
                                <a class="card__contentData card__contentData-mail href="mailto:${friend.email}">${friend.email}</a>
                            </div>
                        </div>`
        friends += card
    }
    friends += '</div></div>'
    return friends
}

function showSearchBar() {
    SEARCH.classList.add(SHOW_ELEM_PRIMARY_ANIMATION)
    SEARCH.classList.add('showElem')
    SEARCH_INPUT.addEventListener('input', search), { once: true }
}

function changeContent(content, show, hide, time) {
    MAIN.classList.remove('scroll')
    if (time) {
        MAIN.classList.add(time)
    }
    MAIN.classList.add(hide)
    MAIN.addEventListener('animationend', function() {
        MAIN.innerHTML = ''
        MAIN.innerHTML = content
        MAIN.classList.remove(hide)
        MAIN.classList.add(show)
        MAIN.addEventListener('animationend', function() {
            MAIN.classList.add('scroll')
            MAIN.classList.remove(show)
            if (time) {
                MAIN.classList.remove(time)
            }
        }, { once: true })
    }, { once: true })
}

function search() {
    const input = SEARCH_INPUT.value
    const tempFilteredBase = []
    if (CURRENT_FRIENDS.length === 0) {
        for (const friend of FRIENDS_SOURCE) {
            const firstName = friend.name.first
            const lastName = friend.name.last

            const template = new RegExp(`^${input}`, "i")
            if (template.test(firstName) || template.test(lastName)) {
                tempFilteredBase.push(friend)
            }
        }
        changeContent(createFriendsScreen(tempFilteredBase), SHOW_ELEM_SECONDARY_ANIMATION, HIDE_ELEM_SECONDARY_ANIMATION, ANIMATION_SPEED)
        SEARCH_INPUT.addEventListener('input', search), { once: true }
    } else {

        for (const friend of CURRENT_FRIENDS) {
            const firstName = friend.name.first
            const lastName = friend.name.last
            const template = new RegExp(`^${input}`, "i")

            if (template.test(firstName) || template.test(lastName)) {
                tempFilteredBase.push(friend)
            }
        }
        changeContent(createFriendsScreen(tempFilteredBase), SHOW_ELEM_SECONDARY_ANIMATION, HIDE_ELEM_SECONDARY_ANIMATION, ANIMATION_SPEED)
        SEARCH_INPUT.addEventListener('input', search), { once: true }
    }
}

function filter() {
    if (!isMusicStopedByUser) {
        playMusic()
    }

    showSearchBar()
    closeSideNav()
    CURRENT_FRIENDS = []

    let userChooseGender = ['male', 'female']
    for (const item of GENDER_RADIO) {
        if (item.checked) {
            userChooseGender = []
            userChooseGender.push(item.getAttribute("data-gender"))
        }
    }

    const userChooseMinAge = RANGE_SLIDER.noUiSlider.get()[0]
    const userChooseMaxAge = RANGE_SLIDER.noUiSlider.get()[1]

    for (const friend of FRIENDS_SOURCE) {
        if ((userChooseGender[0] === friend.gender || userChooseGender[1] === friend.gender) &&
            friend.dob.age >= userChooseMinAge &&
            friend.dob.age <= userChooseMaxAge) {
            CURRENT_FRIENDS.push(friend)
        }
    }

    let sortParameter = false
    for (const item of SORT_RADIO) {
        if (item.checked) {
            sortParameter = item.getAttribute("data-sortAge")
        }
    }
    switch (sortParameter) {
        case '0-100':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.dob.age > b.dob.age) {
                    return 1
                }
                if (a.dob.age < b.dob.age) {
                    return -1
                }
                return 0
            })
            break
        case '100-0':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.dob.age < b.dob.age) {
                    return 1
                }
                if (a.dob.age > b.dob.age) {
                    return -1
                }
                return 0
            })
            break
        case 'name_a-z':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.name.first > b.name.first) {
                    return 1
                }
                if (a.name.first < b.name.first) {
                    return -1
                }
                return 0
            })
            break
        case 'name_z-a':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.name.first < b.name.first) {
                    return 1
                }
                if (a.name.first > b.name.first) {
                    return -1
                }
                return 0
            })
            break
        case 'lastName_a-z':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.name.last > b.name.last) {
                    return 1
                }
                if (a.name.last < b.name.last) {
                    return -1
                }
                return 0
            })
            break
        case 'lastName_z-a':
            CURRENT_FRIENDS.sort(function(a, b) {
                if (a.name.last < b.name.last) {
                    return 1
                }
                if (a.name.last > b.name.last) {
                    return -1
                }
                return 0
            })
            break

        default:
            break
    }

    changeContent(createFriendsScreen(CURRENT_FRIENDS), SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
}

function resetFilter() {
    if (!isMusicStopedByUser) {
        playMusic()
    }

    showSearchBar()
    closeSideNav()
    CURRENT_FRIENDS = []
    for (const item of GENDER_RADIO) {
        if (item.checked) {
            item.checked = false
        }
    }

    RANGE_SLIDER.noUiSlider.updateOptions(
        SLIDER_SETTINGS,
        true // Boolean 'fireSetEvent'
    );

    for (const item of SORT_RADIO) {
        if (item.checked) {
            item.checked = false
        }
    }
    changeContent(createFriendsScreen(FRIENDS_SOURCE), SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
}

function closeSideNav() {
    SEARCH_INPUT.value = ''
    SEARCH_HINT.classList.remove('active')
    document.querySelector('.sidenav-overlay').click()
}

function createRangeSlider() {
    noUiSlider.create(RANGE_SLIDER, SLIDER_SETTINGS)

    for (const point of MAX_AGE_HINT) {
        point.innerHTML = RANGE_SLIDER_MAX_VALUE
    }
    for (const point of MIN_AGE_HINT) {
        point.innerHTML = RANGE_SLIDER_MIN_VALUE
    }

    RANGE_SLIDER.noUiSlider.on('change', function() {
        for (const point of MAX_AGE_HINT) {
            point.innerHTML = RANGE_SLIDER.noUiSlider.get()[0]
        }
        for (const point of MIN_AGE_HINT) {
            point.innerHTML = RANGE_SLIDER.noUiSlider.get()[1]
        }
    })
}

function activateSideNav() {
    const sideNavIco = document.querySelectorAll('.sidenav')
    M.Sidenav.init(sideNavIco, {})
}

function playMusic() {
    APP_AUDIO.play()
    MUSIC_BTN.classList.add('musicBtn-active')
    MUSIC_BTN.classList.add('musicBtn-animation')
    MUSIC_BTN.addEventListener('click', stopMusic, { once: true })
}

function stopMusic() {
    APP_AUDIO.pause()
    MUSIC_BTN.classList.remove('musicBtn-animation')
    MUSIC_BTN.addEventListener('click', playMusic, { once: true })
    isMusicStopedByUser = true
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}
