'use strict'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}


function getClassName(locationObject) {
    var cellClass = `cell-${locationObject.i}-${locationObject.j}`
    return cellClass
}


function openSettings() {

    var settingsModal = document.querySelector('.difficulty')

    !gSettings ? gSettings = true : gSettings = false
    if (gSettings) settingsModal.style.display = 'block'
    else settingsModal.style.display = 'none'
}

function difficulty() {

    var easy = { size: 4, mines: 2 }
    var medium = { size: 8, mines: 12 }
    var hard = { size: 12, mines: 30 }
    var diffs = [easy, medium, hard]

    return diffs
}
