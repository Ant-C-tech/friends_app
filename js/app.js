'use strict'

const MAIN = document.querySelector('#main')

const API_LINK = 'https://randomuser.me/api/'
const APP_DELAY = 1500

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
    }, APP_DELAY);
    // addListeners()
}

function addListeners() {
    document.addEventListener('DOMContentLoaded', function() {
            const sideNavIco = document.querySelectorAll('.sidenav')
            M.Sidenav.init(sideNavIco, {})
        })
        // MAIN.addEventListener('click', function({ target }) {

    // })
}

function createStartScreen() {
    const greeting = `<div class="blockquote-wrapper">
  <div class="blockquote">
    <h1>
     <span class="greeting__word">Friendship</span> is the only <span class="greeting__word">cement</span> that will ever hold the <span class="greeting__word">world</span> together.
     </h1>
    <h4>&mdash;<a href="https://en.wikipedia.org/wiki/Woodrow_Wilson" target="_blank">Woodrow Wilson</a><br></h4>
  </div>
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


// console.log(BASE);
