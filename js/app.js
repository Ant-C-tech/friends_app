'use strict'

const MAIN = document.querySelector('#main')

const API_LINK = 'https://randomuser.me/api/'
const APP_LONG_DELAY = 3000
const APP_DELAY = 1000

//Music
const APP_AUDIO = new Audio('./audio/you_ve_got_a_friend_in_me.mp3')
APP_AUDIO.loop = true
APP_AUDIO.volume = 0.3

const BASE = []


initApp()


function initApp() {
    const timeout = setTimeout(() => {
        console.log(createStartScreen());
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
                // changeContent(createStartGameScr(), showHeader)
        }
    })
}

function createStartScreen() {
    const greeting = `<div class="container greeting__container">
                        <h4>Wow!!!</h4>
                        <h4 class="greeting__text">We found so many people, who want to meet YOU!!!</h4>
                        <a id="startBtn" class="waves-effect waves-light btn-large hoverable startBtn"><i class="material-icons right">announcement</i>Show me them!</a>
                    </div>`
    return greeting
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


// console.log(BASE);
