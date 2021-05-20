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

    !gSettingsState ? gSettingsState = true : gSettingsState = false

    if (gSettingsState) settingsModal.style.display = 'block'
    else settingsModal.style.display = 'none'
}



