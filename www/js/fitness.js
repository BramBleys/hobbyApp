let Fitness = function () {
    let json = [];

    $.getJSON('http://brambleys.sinners.be/api/fitness.php', function (data) {
        $.each(data, function (i) {
            json[i] = data[i];
        });
    });

    function getGroepen() {
        let spiergroep = "";
        $.getJSON('http://brambleys.sinners.be/api/fitness.php', function (data) {
            $.each(data, function (i) {
                if (spiergroep !== json[i].spiergroep) {
                    spiergroep = json[i].spiergroep;
                    $("#fitnessAccordion").append(
                        '<li>' +
                        '<div class="collapsible-header">' + json[i].spiergroep + '</div>' +
                        '<div class="collapsible-body">' +
                        '<table class="striped" id="' + json[i].spiergroep + '">' +
                        '<tr style="display: none"><td></td><td></td></tr>' +
                        '<tr style="display: none"><td></td><td></td></tr>' +
                        '</table>' +
                        '</div>' +
                        '</li>'
                    );
                }
            });
        })
    }

    function vulGroepen() {
        $.getJSON('http://brambleys.sinners.be/api/fitness.php', function (data) {
            let spiergroep = data[0].spiergroep;

            $.each(data, function (i) {
                if (spiergroep === json[i].spiergroep) {
                    voegOefeningenToe(spiergroep, i);
                } else {
                    spiergroep = json[i].spiergroep;
                    voegOefeningenToe(spiergroep, i);
                }
            })
        })
    }

    function voegOefeningenToe(spiergroep, teller) {
        if (json[teller].meerdereTypes === "1") {
            $("#" + spiergroep).append(
                '<tr>' +
                '<td id="oefeningNaam">' + json[teller].oefeningNaam + '</td>' +
                '<td id="type1">' + json[teller].type1 + '</td>' +
                '<td id="gewicht1" contenteditable="true">' + json[teller].gewicht1 + '</td>' +
                '</tr>'
            );
        } else {
            $("#" + spiergroep).append(
                '<tr>' +
                '<td id="oefeningNaam">' + json[teller].oefeningNaam + '</td>' +
                '<td id="geenType">' + json[teller].type1 + '</td>' +
                '<td id="gewicht1" contenteditable="true">' + json[teller].gewicht1 + '</td>' +
                '</tr>'
            );
        }
    }

    function slaGegevensOp(oefening, type, gewicht) {
        let welkGewicht;
        $.each(json, function (i) {
            if (json[i].oefeningNaam === oefening) {
                if (json[i].meerdereTypes === "1") {
                    if (json[i].type1 === type) {
                        welkGewicht = "gewicht1";
                    } else {
                        welkGewicht = "gewicht2";
                    }
                } else {
                    welkGewicht = "gewicht1";
                }
            }
        });

        updateDatabase(oefening, type, gewicht, welkGewicht);
        $("#fitnessAccordion").empty();
        init();
    }

    function updateDatabase(oefening, type, gewicht, welkGewicht) {
        $.ajax({
            url: "http://brambleys.sinners.be/api/updatedb.php",
            data: {oefening: oefening, type: type, gewicht: gewicht, welkGewicht: welkGewicht},
            type: "POST",
            error: function (data) {
                console.log("ERROR!: ", data);
            },
        });
    }

    function init() {
        getGroepen();
        vulGroepen();
    }

    return {
        init: init,
        slaGegevensOp: slaGegevensOp
    }
}();