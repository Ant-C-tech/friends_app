'use strict'

const MAIN = document.querySelector('#main')

const API_LINK = 'https://randomuser.me/api/'
const APP_DELAY = 1500

const BASE = []


initApp()


function initApp() {
    const timeout = setTimeout(() => {
        changeContent(createStartScreen())
        clearTimeout(timeout)
    }, APP_DELAY);
    addListeners()
}

function addListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        const sideNavIco = document.querySelectorAll('.sidenav')
        M.Sidenav.init(sideNavIco, {})
    })
}

function createStartScreen() {

}

function changeContent(content, callback) {
    MAIN.classList.add('hide')
    MAIN.addEventListener('transitionend', function() {
        MAIN.innerHTML = ''
        MAIN.innerHTML = content
        callback && callback()
        MAIN.classList.remove('hide')
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
