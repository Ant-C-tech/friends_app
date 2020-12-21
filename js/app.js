'use strict'

const MAIN = document.querySelector('#main')
const HEADER = document.querySelector('#nav')
const SEARCH = document.querySelector('.search')
const SEARCH_HINT = document.querySelector('.search__hint')
const RESET = document.querySelector('.resetBtn')
const FILTER = document.querySelector('.filterBtn')
const SEARCH_INPUT = document.querySelector('#icon_prefix')
const GENDER_RADIO = document.querySelectorAll('.aside__radioGender')
const SLIDER = document.getElementById('test-slider')
const SORT_RADIO = document.querySelectorAll('.aside__sort')
const MAX_AGE_HINT = document.querySelectorAll('.maxAge')
const MIN_AGE_HINT = document.querySelectorAll('.minAge')

const API_LINK = 'https://randomuser.me/api/'

const APP_LONG_DELAY = 3000
const APP_DELAY = 1000
const NUM_FRIENDS_MIN = 10
const NUM_FRIENDS_MAX = 20

//Music
const APP_AUDIO = new Audio('./audio/you_ve_got_a_friend_in_me.mp3')
APP_AUDIO.loop = true
APP_AUDIO.volume = 0.3

const BASE = []
let FILTERED_BASE = []


initApp()


function initApp() {
    getFriends(_getRandomIntInclusive(NUM_FRIENDS_MIN, NUM_FRIENDS_MAX))
    addListeners()

    noUiSlider.create(SLIDER, {
        start: [20, 80],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    })

    setSliderHintDefault()

    SLIDER.noUiSlider.on('change', function() {
        for (const point of MAX_AGE_HINT) {
            point.innerHTML = SLIDER.noUiSlider.get()[0]
        }
        for (const point of MIN_AGE_HINT) {
            point.innerHTML = SLIDER.noUiSlider.get()[1]
        }
    })
}

function getFriends(num) {
    fetch(`${API_LINK}?results=${num}`)
        .then(function(resp) {
            return resp.json()
        }).then(function(data) {
            for (let index = 0; index < data.results.length; index++) {
                BASE.push(data.results[index])
            }
        })
        .catch(function() {
            changeContent('<h1>Something went wrong, we are so sorry:( Please, reload the page!</h1>')
        })
}

function addListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        const sideNavIco = document.querySelectorAll('.sidenav')
        M.Sidenav.init(sideNavIco, {})
    })

    const timeout = setTimeout(() => {
        changeContent(createStartScreen(), 'animate__zoomIn', 'animate__zoomOut')
        clearTimeout(timeout)
    }, APP_LONG_DELAY)

    FILTER.addEventListener('click', filter)
    RESET.addEventListener('click', resetFilter)

    MAIN.addEventListener('click', function({ target }) {
        if (target.classList.contains('startBtn')) {
            changeContent(createFriendsScreen(BASE), 'animate__zoomIn', 'animate__zoomOut')
            showSearchBar()
            APP_AUDIO.play()
        }
    }, { once: true })
}

function createStartScreen() {
    const greeting = `<div class="container greeting__container h-100 flexContainerCol">
                        <h4>Wow!!!</h4>
                        <h4 class="greeting__text">We found so many people, who want to meet YOU!!!</h4>
                        <a id="startBtn" class="waves-effect waves-light btn-large hoverable startBtn"><i class="material-icons right">announcement</i>Show me them all!</a>
                    </div>`
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
    SEARCH.classList.add('animate__zoomIn')
    SEARCH.classList.remove('d-none')
    SEARCH.classList.add('d-block')
    SEARCH_INPUT.addEventListener('input', search), { once: true }
}

function changeContent(content, show, hide) {
    MAIN.classList.remove('scroll')
    MAIN.classList.add(hide)
    MAIN.addEventListener('animationend', function() {
        MAIN.innerHTML = ''
        MAIN.innerHTML = content
        MAIN.classList.remove(hide)
        MAIN.classList.add(show)
        MAIN.addEventListener('animationend', function() {
            MAIN.classList.add('scroll')
            MAIN.classList.remove(show)
        }, { once: true })
    }, { once: true })
}

function search() {
    const input = SEARCH_INPUT.value
    const tempFilteredBase = []
    if (FILTERED_BASE.length === 0) {
        for (const friend of BASE) {
            const firstName = friend.name.first
            const lastName = friend.name.last

            const template = new RegExp(`^${input}`, "i")
            if (template.test(firstName) || template.test(lastName)) {
                tempFilteredBase.push(friend)
            }
        }
        changeContent(createFriendsScreen(tempFilteredBase), 'animate__bounceIn', 'animate__bounceOut')
        SEARCH_INPUT.addEventListener('input', search), { once: true }
    } else {

        for (const friend of FILTERED_BASE) {
            const firstName = friend.name.first
            const lastName = friend.name.last
            const template = new RegExp(`^${input}`, "i")

            if (template.test(firstName) || template.test(lastName)) {
                tempFilteredBase.push(friend)
            }
        }
        changeContent(createFriendsScreen(tempFilteredBase), 'animate__bounceIn', 'animate__bounceOut')
        SEARCH_INPUT.addEventListener('input', search), { once: true }
    }
}

function filter() {
    showSearchBar()
    closeSideNav()
    FILTERED_BASE = []

    let userChooseGender = ['male', 'female']
    for (const item of GENDER_RADIO) {
        if (item.checked) {
            userChooseGender = []
            userChooseGender.push(item.getAttribute("data-gender"))
        }
    }

    const userChooseMinAge = SLIDER.noUiSlider.get()[0]
    const userChooseMaxAge = SLIDER.noUiSlider.get()[1]

    for (const friend of BASE) {
        if ((userChooseGender[0] === friend.gender || userChooseGender[1] === friend.gender) &&
            friend.dob.age >= userChooseMinAge &&
            friend.dob.age <= userChooseMaxAge) {
            FILTERED_BASE.push(friend)
        }
    }

    let sortParameter = false
    for (const item of SORT_RADIO) {
        if (item.checked) {
            sortParameter = item.getAttribute("data-sortAge")
        }
    }
    if (sortParameter === '0-100') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.dob.age > b.dob.age) {
                return 1
            }
            if (a.dob.age < b.dob.age) {
                return -1
            }
            return 0
        })
    }
    if (sortParameter === '100-0') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.dob.age < b.dob.age) {
                return 1
            }
            if (a.dob.age > b.dob.age) {
                return -1
            }
            return 0
        })
    }
    if (sortParameter === 'name_a-z') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.name.first > b.name.first) {
                return 1
            }
            if (a.name.first < b.name.first) {
                return -1
            }
            return 0
        })
    }
    if (sortParameter === 'name_z-a') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.name.first < b.name.first) {
                return 1
            }
            if (a.name.first > b.name.first) {
                return -1
            }
            return 0
        })
    }
    if (sortParameter === 'lastName_a-z') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.name.last > b.name.last) {
                return 1
            }
            if (a.name.last < b.name.last) {
                return -1
            }
            return 0
        })
    }
    if (sortParameter === 'lastName_z-a') {
        FILTERED_BASE.sort(function(a, b) {
            if (a.name.last < b.name.last) {
                return 1
            }
            if (a.name.last > b.name.last) {
                return -1
            }
            return 0
        })
    }

    changeContent(createFriendsScreen(FILTERED_BASE), 'animate__zoomIn', 'animate__zoomOut')
}

function resetFilter() {
    closeSideNav()
    FILTERED_BASE = []
    for (const item of GENDER_RADIO) {
        if (item.checked) {
            item.checked = false
        }
    }
    SLIDER.noUiSlider.set([20, 80])
    setSliderHintDefault()
    for (const item of SORT_RADIO) {
        if (item.checked) {
            item.checked = false
        }
    }
    changeContent(createFriendsScreen(BASE), 'animate__zoomIn', 'animate__zoomOut')
}

function closeSideNav() {
    SEARCH_INPUT.value = ''
    SEARCH_HINT.classList.remove('active')
    document.querySelector('.sidenav-overlay').click()
}

function setSliderHintDefault() {
    for (const point of MAX_AGE_HINT) {
        point.innerHTML = SLIDER.noUiSlider.get()[0]
    }
    for (const point of MIN_AGE_HINT) {
        point.innerHTML = SLIDER.noUiSlider.get()[1]
    }
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}


// console.log(BASE)
