document.addEventListener('DOMContentLoaded', function() {
    const sideNavIco = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sideNavIco, {});
});

let base = []
getFriends(5)

function getFriends(num) {
    fetch(`https://randomuser.me/api/?results=${num}`)
        .then(function(resp) {
            return resp.json()
        }).then(function(data) {
            for (let index = 0; index < data.results.length; index++) {
                base.push(data.results[index]);
            }
        })
        .catch(function() {

        })
}


console.log(base);
