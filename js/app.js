'use strict'

const MAIN = document.querySelector('#main')
const HEADER = document.querySelector('#header')
const MUSIC_BTN = document.querySelector('#musicBtn')
const SEARCH = document.querySelector('.search')
const SEARCH_HINT = document.querySelector('.search__hint')
const RESET = document.querySelector('.resetBtn')
const FILTER = document.querySelector('.filterBtn')
const SEARCH_INPUT = document.querySelector('#icon_prefix')
const RANGE_SLIDER = document.getElementById('test-slider')
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

const APP_AUDIO = new Audio('./audio/you_ve_got_a_friend_in_me.mp3')
APP_AUDIO.loop = true
APP_AUDIO.volume = 0.3

let FRIENDS_SOURCE
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
            FRIENDS_SOURCE = data.results
        }).then(function() {
            const timeout = setTimeout(() => {
                changeContent(createStartScreen(), SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
                clearTimeout(timeout)
            }, APP_LONG_DELAY)
        })
        .catch(function(error) {
            console.log(error.message)
            changeContent(`<h1 class="container h-100 flexContainerCol errorMes">Something went wrong, we are so sorry :( Please, reload the page!</h1>`, SHOW_ELEM_PRIMARY_ANIMATION, HIDE_ELEM_PRIMARY_ANIMATION)
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
    return `<div class="container greeting__container flexContainerCol">
                <h4> Wow!!!</h4 >
                <h4 class="greeting__text" > We found so many people, who want to meet YOU!!!</h4>
                <a id="startBtn" class="waves-effect waves-light btn-large hoverable startBtn">
                    <i class="material-icons right">announcement</i>
                    Show me them all!
                </a>
            </div>`
}

function createFriendsScreen(friends) {
    let FriendsScreen = '<div class="container friends__container"><div class="flexContainerRow">'
    friends.forEach(friend => {
        const card = `<div class="card">
                            <div class="card-image">
                                <img class="card__img" src="${friend.picture.large}" alt="person photo">
                                <span class="card-title card__title card__title-${friend.gender}">${friend.name.first} ${friend.name.last}</span>
                            </div>
                            <div class="card-content card__content">
                                <p>Hi, I am <span class="card__contentData">${friend.dob.age}</span> years old and I live in <span class="card__contentData">${friend.location.city}, ${friend.location.country}</span>.</p>
                                <p>Call me, I want to be your friend.</p>
                                <a href="tel:${friend.phone}" class="card__contentData">${friend.phone}</a>
                            </div>
                                <div class="card-action">
                                <a class="card__contentData card__contentData-mail href="mailto:${friend.email}">${friend.email}</a>
                            </div>
                        </div>`
        FriendsScreen += card
    })
    FriendsScreen += '</div></div>'
    return FriendsScreen
}

function showSearchBar() {
    SEARCH.classList.add(SHOW_ELEM_PRIMARY_ANIMATION)
    SEARCH.classList.add('showElem')
    SEARCH_INPUT.addEventListener('input', toSearch)
}

//Function is waiting to get content for display and some classes of AnimateCSS to animation including animation speed (optional)
function changeContent(content, show, hide, speed) {

    //Preparation displayed content for animation of hiding
    MAIN.classList.remove('scroll') //Hide scrollbar (for estetic purpose)
    if (speed) {
        MAIN.classList.add(speed) // Adding class that will define speed of animation(optional)
    }

    //Hiding displayed content using AnimateCSS class
    MAIN.classList.add(hide)

    //Waiting for end of animation of hiding content...
    MAIN.addEventListener('animationend', function() {
            //...and then...
            MAIN.innerHTML = '' //Clear content
            MAIN.innerHTML = content //Add new content
            MAIN.classList.remove(hide) //Clean up unnecessary class

            //Start animation of showing new content
            MAIN.classList.add(show)

            //Waiting for end of animation of showing content...
            MAIN.addEventListener('animationend', function() {
                    //...and then...
                    MAIN.classList.add('scroll') //Show scrollbar back
                    MAIN.classList.remove(show) //Clean up unnecessary class
                    if (speed) {
                        MAIN.classList.remove(speed) //Clean up unnecessary class
                    }

                }, { once: true }) // Use listeners once and automatically removing after invoke
        }, { once: true }) //in order not to accumulate listeners after each function's call

}

function toSearch() {
    const input = SEARCH_INPUT.value.toLowerCase()

    let foundFriends = (CURRENT_FRIENDS.length === 0) ?
        FRIENDS_SOURCE.filter(friend => (friend.name.first.toLowerCase().startsWith(input) || friend.name.last.toLowerCase().startsWith(input))) :
        CURRENT_FRIENDS.filter(friend => (friend.name.first.toLowerCase().startsWith(input) || friend.name.last.toLowerCase().startsWith(input)))

    changeContent(createFriendsScreen(foundFriends), SHOW_ELEM_SECONDARY_ANIMATION, HIDE_ELEM_SECONDARY_ANIMATION, ANIMATION_SPEED)
}

function filter() {
    //In case user enter to app through sidenav (not using startBtn)
    if (!isMusicStopedByUser) {
        playMusic()
    }
    showSearchBar()
    closeSideNav()

    let userChooseGender = (document.querySelector("input[type='radio'][name='gender']:checked")) ? [document.querySelector("input[type='radio'][name='gender']:checked").getAttribute("data-gender")] : ['male', 'female']
    const [userChooseMinAge, userChooseMaxAge] = RANGE_SLIDER.noUiSlider.get()

    CURRENT_FRIENDS = FRIENDS_SOURCE.filter(friend => (userChooseGender.includes(friend.gender) && friend.dob.age >= userChooseMinAge && friend.dob.age <= userChooseMaxAge))

    let sortParameter = (document.querySelector("input[type='radio'][name='sort']:checked")) ? document.querySelector("input[type='radio'][name='sort']:checked").getAttribute("data-sort") : false
    console.log(sortParameter);

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
    //In case user enter to app through sidenav (not using startBtn)
    if (!isMusicStopedByUser) {
        playMusic()
    }
    showSearchBar()
    closeSideNav()

    CURRENT_FRIENDS = []
    if (document.querySelector("input[type='radio'][name='gender']:checked")) {
        document.querySelector("input[type='radio'][name='gender']:checked").checked = false
    }
    resetRangeSlider()
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
            point.innerHTML = RANGE_SLIDER.noUiSlider.get()[1]
        }
        for (const point of MIN_AGE_HINT) {
            point.innerHTML = RANGE_SLIDER.noUiSlider.get()[0]
        }
    })
}

function resetRangeSlider() {
    RANGE_SLIDER.noUiSlider.updateOptions(
        SLIDER_SETTINGS
    );

    for (const point of MAX_AGE_HINT) {
        point.innerHTML = RANGE_SLIDER_MAX_VALUE
    }
    for (const point of MIN_AGE_HINT) {
        point.innerHTML = RANGE_SLIDER_MIN_VALUE
    }
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
