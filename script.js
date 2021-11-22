$(document).ready(function() {
    console.log('Document initialized successfully.')
});

function rng(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function calculateColor(number) {
    return `rgb(${Math.round(number * 5)}, ${250 - Math.round(number * 5)}, 0)`
}

function removeMinus(number) {
    return Math.sqrt(number * number)
}

var points = 0;
var round = 0;
var leftPartSize = 0;
var rightPartSize = 0;

function inputValChange(input, oppositeInput) {
    const value = $(`#${input}`).val();
    if (value >= 0) {
        var valueFinal = 100 - value
        if (valueFinal >= 0) {
            $(`#${oppositeInput}`).val(valueFinal);
        } else {
            $(`#${input}`).val(100);
            $(`#${oppositeInput}`).val(0);
        }
    } else {
        $(`#${input}`).val(0);
        $(`#${oppositeInput}`).val(100);
    }
}

function generateRound() {
    leftPartSize = rng(0, 100);
    rightPartSize = 100 - leftPartSize;
    $('#lPart').css('width', leftPartSize + "%");
    $('#rPart').css('width', rightPartSize + "%");
    $('#controlsButton').removeAttr('style').val('Confirm').attr("onclick", "checkGuess()");
    $('#instructions').text("Enter the percentage you think the lines take up, then press 'Confirm'!");
    $('#round').text(round);
}

function checkGuess() {
    const lPartGuess = $('#lPartInput').val();
    const rPartGuess = $('#rPartInput').val();
    const difference = removeMinus(leftPartSize - lPartGuess);
    $('#lPartGuess').css('width', lPartGuess + "%");
    $('#rPartGuess').css('width', rPartGuess + "%");
    if (difference == 0) {
        $('#instructions').text("PERFECT GUESS! Press the button again to continue.");
        points = points + (50 - difference);
        $('#controlsButton').val(`+${50 - difference} points!`).attr("onclick", "continuePlaying()").css("color", calculateColor(difference)).css("border", calculateColor(difference) + 'solid 2px');
        $('#controlsButton').css("color", calculateColor(0));
    } else if (difference > 0 && difference < 50) {
        $('#instructions').text(`GUESSED! You were ${difference} percent off. Press the button again to continue.`);
        points = points + (50 - difference);
        $('#controlsButton').val(`+${50 - difference} points!`).attr("onclick", "continuePlaying()").css("color", calculateColor(difference)).css("border", calculateColor(difference) + 'solid 2px');
    } else if (difference >= 50) {
        $('#instructions').text(`FAILED! You were ${difference} percent off. Press the button again to continue.`);
        $('#controlsButton').val("+0 points").attr("onclick", "continuePlaying()").css("color", calculateColor(50)).css("border", calculateColor(50) + 'solid 2px');
    }
    $('#score').text(points)
}

function continuePlaying() {
    $('#lPartGuess').css('width', "0%");
    $('#rPartGuess').css('width', "0%");
    $('#lPartInput').val(null);
    $('#rPartInput').val(null);
    if (round < 10) {
        round = round + 1;
        $('#round').text(round);
        generateRound();
    } else activateWinScreen()
}

function activateWinScreen() {
    $('.winScreen').css('display', 'block');
    $('#finalScoreCounter').text(points);
    const container = document.querySelector('.winScreenFireworks');
    const fireworks = new Fireworks(container, {});
    fireworks.start();
}