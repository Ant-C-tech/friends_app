'use strict'

const MAIN = document.querySelector('#main')

const API_LINK = 'https://randomuser.me/api/'
const APP_LONG_DELAY = 3000
const APP_DELAY = 1000
const NUM_FRIENDS_MIN = 5
const NUM_FRIENDS_MAX = 10

//Music
const APP_AUDIO = new Audio('./audio/you_ve_got_a_friend_in_me.mp3')
APP_AUDIO.loop = true
APP_AUDIO.volume = 0.3

const BASE = []


initApp()


function initApp() {
    getFriends(_getRandomIntInclusive(NUM_FRIENDS_MIN, NUM_FRIENDS_MAX))
    const timeout = setTimeout(() => {
        changeContent(createStartScreen())
        clearTimeout(timeout)
    }, APP_LONG_DELAY);
    addListeners()
}

function addListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        const sideNavIco = document.querySelectorAll('.sidenav')
        M.Sidenav.init(sideNavIco, {})
    })
    MAIN.addEventListener('click', function({ target }) {
        if (target.classList.contains('startBtn')) {
            APP_AUDIO.play()
            changeContent(createFriendsScreen())
        }
    })
}

function createStartScreen() {
    const greeting = `<div class="container greeting__container h-100 flexContainerCol">
                        <h4>Wow!!!</h4>
                        <h4 class="greeting__text">We found so many people, who want to meet YOU!!!</h4>
                        <a id="startBtn" class="waves-effect waves-light btn-large hoverable startBtn"><i class="material-icons right">announcement</i>Show me them all!</a>
                    </div>`
    return greeting
}

function createFriendsScreen() {
    let friends = '<div class="container friends__container"><div class="flexContainerRow">'
    for (const friend of BASE) {
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

function changeContent(content, callback) {
    MAIN.classList.add('hideElem')
    MAIN.addEventListener('transitionend', function() {
        MAIN.innerHTML = ''
        MAIN.innerHTML = content
        callback && callback()
        MAIN.classList.remove('hideElem')
    }, { once: true })
}

function getFriends(num) {
    fetch(`${API_LINK}?results=${num}`)
        .then(function(resp) {
            return resp.json()
        }).then(function(data) {
            for (let index = 0; index < data.results.length; index++) {
                BASE.push(data.results[index]);
            }
        })
        .catch(function() {

        })
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


console.log(BASE);
