let jsonFitness = [];
let jsonMuziek = [];

let laagste = 0;
let stap = 5;
let hoogste = stap;
let lengte;
let verschil;

let gewichten = {};
let types = {};
let nieuweTekst;
let nieuwGewicht;

$(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        console.log(thrownError);
        alert('Triggered ajaxError handler');
    });

    $.getJSON('http://brambleys.sinners.be/api/fitness.php', function (data) {
        $.each(data, function (i) {
            jsonFitness[i] = data[i];
        });

        $.each(data, function (i) {
            if (data[i].meerdereTypes === "1") {
                types[data[i].oefeningNaam] = [data[i].type1, data[i].type2];
                gewichten[data[i].oefeningNaam] = [data[i].gewicht1, data[i].gewicht2];
            }
        });
    });

    $.getJSON('http://brambleys.sinners.be/api/muziek.php', function (data) {
        $.each(data, function (i) {
            jsonMuziek[i] = data[i];
        });
    });

    $('.modal').modal();

    $('.button-collapse').sideNav();

    $('.side-nav a[data-show]').click(function () {
        $('.spa').hide();

        $('#' + $(this).data('show')).show();

        $('.button-collapse').sideNav('hide');
    });

    $(".brand-logo").click(function () {
        $('.spa').show();
    });

    $(".button-collapse").click(function () {
        let active = isActief();
        if (active) {
            $("#pijl").html("keyboard_arrow_up");
        } else {
            $("#pijl").html("keyboard_arrow_down");
        }
    });

    $("#keuzelijst").click(function () {
        let active = isActief();
        if (active) {
            $("#pijl").html("keyboard_arrow_down");
        } else {
            $("#pijl").html("keyboard_arrow_up");
        }
    });

    function isActief() {
        let klasse = $("#keuzelijst").attr("class");

        if (klasse === "active") {
            return true;
        } else {
            return false;
        }
    }

    $("ul").on("click", "#type1", function () {
        let oefening = $(this).siblings("#oefeningNaam").html();
        let type = $(this).html();
        let gewicht = $(this).siblings("#gewicht1").html();

        $.each(types, function (key, value) {
            if (key === oefening) {
                if (value[0] === type) {
                    nieuweTekst = value[1];
                } else {
                    nieuweTekst = value[0];
                }
            }
        });

        $.each(gewichten, function (key, value) {
            if (key === oefening) {
                if (value[0] === gewicht) {
                    nieuwGewicht = value[1];
                } else {
                    nieuwGewicht = value[0];
                }
            }
        });

        $(this).html(nieuweTekst);
        $(this).siblings("#gewicht1").html(nieuwGewicht);
    });

    $("ul").on("blur", "#gewicht1", function () {
        let oefening = $(this).siblings("#oefeningNaam").html();
        let type = $(this).siblings("#type1").html();
        let gewicht = $(this).html();

        if (type === "") {
            type = $(this).siblings("#geenType").html();
        }

        Fitness.slaGegevensOp(oefening, type, gewicht);
    });

    $("#startStappenteller").click(function () {
        let successHandler = function (pedometerData) {
            $("#stappen").html(pedometerData.numberOfSteps);
        };
        pedometer.startPedometerUpdates(successHandler);
    });

    $("#stopStappenteller").click(function () {
        pedometer.stopPedometerUpdates();
    });

    $(".vorige").click(function () {
        let type = $(this).data('type');

        if (type === "muziekCollection") {
            $("#muziekCollection").html("");

            if (hoogste !== lengte) {
                if (laagste < stap) {
                    laagste = 0;
                    hoogste = stap;
                } else {
                    laagste -= stap;
                    hoogste -= stap;
                }
            } else {
                hoogste = laagste;
                laagste -= stap;
            }

            Muziek.toonLiedjes(laagste, hoogste);
        } else {

        }
    });

    $(".volgende").click(function () {
        let type = $(this).data('type');

        if (type === "muziekCollection") {
            $("#muziekCollection").empty();

            let liedjes = JSON.parse(localStorage.getItem('liedjes'));
            let lengteLiedjes = 0;

            if (liedjes !== null) {
                lengteLiedjes = liedjes.length;
            }

            let lengteMuziek = jsonMuziek.length;
            lengte = lengteLiedjes + lengteMuziek;
            verschil = lengte % stap;

            if ((hoogste + stap) > lengte) {
                hoogste = lengte;
                if ((laagste + stap) > lengte) {
                    laagste = lengte - verschil;
                }
                else {
                    laagste += stap;
                }
            } else {
                hoogste += stap;
                laagste += stap;
            }

            Muziek.toonLiedjes(laagste, hoogste);
        } else {

        }

    });

    $(".submitKnop").click(function () {
        event.preventDefault();
        let titel = $(this).parent().children(".input-field").children("#titel").val();
        let artiest = $(this).parent().children(".input-field").children("#artiest").val();
        let link = $(this).parent().children(".input-field").children("#link").val();
        let categorie = $(this).parent().children("#categorieSelect").val();
        let instrument = $(this).parent().children("#instrumentSelect").val();


        if (titel !== "" && artiest !== "") {
            if (link === "") {
                link = "leeg";
            }
            Muziek.voegLiedjeToe(titel, artiest, link, instrument, categorie);
            $("#popupFormulier").modal("close");
        } else {
            event.preventDefault();
            $(this).siblings("#alert").addClass("revealed");
        }

        //TODO all velden nog terug leeg maken
    });
});

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    Fitness.init();
    Muziek.init(laagste, hoogste);
}

function onPause() {
    Muziek.slaGegevensOp();
    localStorage.clear();
}

function onResume() {

}