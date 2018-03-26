let Muziek = function () {
    let liedjes = [];

    let json = [];
    $.getJSON('http://brambleys.sinners.be/api/muziek.php', function (data) {
        $.each(data, function (i) {
            json[i] = data[i];
        });
    });

    function init(laagste, hoogste) {
        toonliedjes(laagste, hoogste);
    }

    function toonliedjes(laagste, hoogste, categorie) {
        for (let i = laagste; i < hoogste; i++) {
            if (i < json.length) {
                $("#muziekCollection").append(
                    '<li class="collection-item"><a class="link" href="' + json[i].link + '">' + json[i].titel + ' - ' + json[i].artiest + '</a></li>'
                );
            } else {
                updateLijst();
            }
        }
    }

    function voegLiedjeToe(titel, artiest, link, instrument, categorie) {
        let liedje = {titel: titel, artiest: artiest, link: link, instrument: instrument, categorie: categorie};
        liedjes.push(liedje);
        setLocalStorage();
    }

    function updateLijst() {
        let getLiedjes = JSON.parse(localStorage.getItem('liedjes'));
        $("li").remove(".localStorage");

        for (let i = 0; i < getLiedjes.length; i++) {
            $("#muziekCollection").append(
                '<li class="collection-item localStorage">' + getLiedjes[i].titel + ' - ' + getLiedjes[i].artiest + '</li>'
            );
        }
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
                    success: function (data) {
                        console.log("Succes!: ", data);
                    },
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