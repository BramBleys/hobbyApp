let Muziek = function () {
    let liedjes = [];
    let jsonGitaar = [];
    let jsonPiano = [];
    let jsonDrum = [];
    let tellerGitaar = 0;
    let tellerPiano = 0;
    let tellerDrum = 0;

    $.getJSON('http://brambleys.sinners.be/api/muziek.php', function (data) {
        $.each(data, function (i) {
            if (data[i].instrument === "gitaar") {
                jsonGitaar[tellerGitaar] = data[i];
                tellerGitaar++;
            } else if (data[i].instrument === "piano") {
                jsonPiano[tellerPiano] = data[i];
                tellerPiano++;
            } else {
                jsonDrum[tellerDrum] = data[i];
                tellerDrum++;
            }
        });
    });

    function init(laagste, hoogste) {
        toonliedjes(laagste, hoogste, "gitaar");
        toonliedjes(laagste, hoogste, "piano");
        toonliedjes(laagste, hoogste, "drum");
    }

    function toonliedjes(laagste, hoogste, instrument) {
        for (let i = laagste; i < hoogste; i++) {
            if (instrument === "gitaar") {
                if (i < jsonGitaar.length) {
                    $("#muziekCollectionGitaar").append(
                        '<li class="collection-item"><a class="link" href="' + jsonGitaar[i].link + '">' + jsonGitaar[i].titel + ' - ' + jsonGitaar[i].artiest
                        + '</a><a class="secondary-content">' + jsonGitaar[i].categorie + '</a>' + '</li>'
                    );
                } else {
                    updateLijst();
                }
            } else if (instrument === "piano") {
                if (i < jsonPiano.length) {
                    $("#muziekCollectionPiano").append(
                        '<li class="collection-item"><a class="link" href="' + jsonPiano[i].link + '">' + jsonPiano[i].titel + ' - ' + jsonPiano[i].artiest
                        + '</a><a class="secondary-content">' + jsonPiano[i].categorie + '</a>' + '</li>'
                    );
                } else {
                    updateLijst();
                }
            } else {
                if (i < jsonDrum.length) {
                    $("#muziekCollectionDrum").append(
                        '<li class="collection-item"><a class="link" href="' + jsonDrum[i].link + '">' + jsonDrum[i].titel + ' - ' + jsonDrum[i].artiest
                        + '</a><a class="secondary-content">' + jsonDrum[i].categorie + '</a>' + '</li>'
                    );
                } else {
                    updateLijst();
                }
            }
        }
    }

    function updateLijst() {
        let getLiedjes = JSON.parse(localStorage.getItem('liedjes'));
        $("li").remove(".localStorage");

        if (getLiedjes !== null) {
            for (let i = 0; i < getLiedjes.length; i++) {
                if (getLiedjes[i].instrument === "gitaar") {
                    $("#muziekCollectionGitaar").append(
                        '<li class="collection-item localStorage"><a class="link" href="' + getLiedjes[i].link + '">' + getLiedjes[i].titel + ' - ' + getLiedjes[i].artiest
                        + '</a><a class="secondary-content">' + getLiedjes[i].categorie + '</a>' + '</li>'
                    );
                } else if (getLiedjes[i].instrument === "piano") {
                    $("#muziekCollectionPiano").append(
                        '<li class="collection-item localStorage"><a class="link" href="' + getLiedjes[i].link + '">' + getLiedjes[i].titel + ' - ' + getLiedjes[i].artiest
                        + '</a><a class="secondary-content">' + getLiedjes[i].categorie + '</a>' + '</li>'
                    );
                } else {
                    $("#muziekCollectionDrum").append(
                        '<li class="collection-item localStorage"><a class="link" href="' + getLiedjes[i].link + '">' + getLiedjes[i].titel + ' - ' + getLiedjes[i].artiest
                        + '</a><a class="secondary-content">' + getLiedjes[i].categorie + '</a>' + '</li>'
                    );
                }
            }
        }
    }

    function voegLiedjeToe(titel, artiest, link, instrument, categorie) {
        let liedje = {titel: titel, artiest: artiest, link: link, instrument: instrument, categorie: categorie};
        liedjes.push(liedje);
        setLocalStorage();
    }

    function setLocalStorage() {
        localStorage.setItem('liedjes', JSON.stringify(liedjes));
        updateLijst();
    }

    function slaGegevensOp() {
        let getLiedjes = JSON.parse(localStorage.getItem('liedjes'));
        if (getLiedjes !== null) {
            for (let i = 0; i < getLiedjes.length; i++) {
                $.ajax({
                    url: "http://brambleys.sinners.be/api/insertMuziek.php",
                    data: {
                        titel: getLiedjes[i].titel,
                        artiest: getLiedjes[i].artiest,
                        link: getLiedjes[i].link,
                        instrument: getLiedjes[i].instrument,
                        categorie: getLiedjes[i].categorie
                    },
                    type: "POST",
                    error: function (data) {
                        console.log("ERROR!: ", data);
                    },
                });
            }
        }
        liedjes = [];
    }

    return {
        init: init,
        toonLiedjes: toonliedjes,
        voegLiedjeToe: voegLiedjeToe,
        slaGegevensOp: slaGegevensOp
    }
}();