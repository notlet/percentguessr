$(document).ready(function () {
    getLatestCommit();
    console.log('Document initialized successfully.');
    document.addEventListener("keyup", function (e) {
        if (e.code === 'Enter') {
            document.getElementById('controlsButton').click();
        }
    });
});

function rng(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function calculateColor(number) {
    return `rgb(${Math.round(number * 5)}, ${250 - Math.round(number * 5)}, 0)`
}

Number.prototype.removeMinus = function () {
    return Math.sqrt(this * this)
}

var points = 0;
var round = 0;
var leftPartSize = 0;
var rightPartSize = 0;

function inputValChange(input, oppositeInput) {
    const value = $(`#${input}`).val();
    if (value == '') {
        $(`#${oppositeInput}`).val('');
    } else if (value >= 0) {
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
    var lPartGuess = $('#lPartInput').val();
    var rPartGuess = $('#rPartInput').val();
    var difference = undefined;
    if (lPartGuess !== '') {
        difference = (leftPartSize - lPartGuess).removeMinus();
    } else {
        lPartGuess = 0;
        rPartGuess = 0;
    }
    $('#lPartGuess').css('width', lPartGuess + "%");
    $('#rPartGuess').css('width', rPartGuess + "%");
    if (difference == undefined) {
        $('#instructions').text(`FAILED! You didn't enter anything. Press the button again to continue.`);
        $('#controlsButton').val("+0 points").attr("onclick", "continuePlaying()").css("color", calculateColor(50)).css("border", calculateColor(50) + 'solid 2px');
    } else if (difference == 0) {
        $('#instructions').text("PERFECT GUESS! Press the button again to continue.");
        points = points + (50 - difference);
        $('#controlsButton').val(`+${50 - difference} points!`).attr("onclick", "continuePlaying()").css("color", calculateColor(difference)).css("border", calculateColor(difference) + 'solid 2px');
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

var winScreenActivated = false;

function activateWinScreen() {
    if (winScreenActivated == false) {
        winScreenActivated = true;
        $('#controlsButton').val("Press ENTER to reload").attr("onclick", "location.reload()").removeAttr('style');
        $('.winScreen').css('display', 'block');
        $('#finalScoreCounter').text(points);
        const container = document.querySelector('.winScreenFireworks');
        const fireworks = new Fireworks(container, {});
        fireworks.start();
    }
}

function getLatestCommit() {
    const request = new Request('https://api.github.com/repos/LetGame/percentguessr/commits')
    fetch(request)
        .then(function (response) {
            if (!response.ok) {
                throw console.error('Error! Something went wrong requesting GitHub API!')
            }
            return response.json();
        })
        .then(function (response) {
            const latestCommit = response[0]
            const latestCommitNameAndVersion = latestCommit.commit.message.split('\n')[0];
            const latestCommitName = latestCommitNameAndVersion.split(' v')[0];
            const latestCommitVersion = latestCommitNameAndVersion.split(' v')[1];
            const latestCommitURL = 'https://github.com/LetGame/percentguessr/commit/' + latestCommit.sha

            $('#updateName').text(latestCommitName).attr('href', latestCommitURL).attr('title', latestCommit.commit.message);
            if (latestCommitVersion !== undefined) {
                $('#updateVersion').text('v' + latestCommitVersion).attr('href', latestCommitURL).attr('title', latestCommit.commit.message);
            }
        });
}