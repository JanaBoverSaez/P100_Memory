
var ampladaCarta, alcadaCarta;

var separacioH = 20,
    separacioV = 20;
var nFiles = 3,
    nColumnes = 6;
var nClicks = 0;
var nMaxClicks;


//JBS: So cartes (afegint mp3 a carpeta sounds Visual Studio)
const so1 = new Audio('../sounds/gircarta.mp3');
const so2 = new Audio('../sounds/parella.mp3');
so1.volume = 1.0;
so2.volume = 1.0;

function reproduirSo_gircarta() {
    so1.currentTime = 0; // Reinicia el so al principi
    so1.play(); // Reprodueix el so
}
function reproduirSo_parella() {
    so2.currentTime = 0; // Reinicia el so al principi
    so2.play(); // Reprodueix el so
}

// Funcio per guardar totes les cartes en un array
function cartes() {
    var cartes = [];
    for (var i = 1; i <= 52; i++) {
        cartes.push('carta' + i);
    }
    return cartes;
}

// Funcio per generar les parelles de cartes del joc
function jocCartes() {
    var cartesJoc = cartes();
    var cartesEscollides = [];

    // Escollir aleatoriament la meitat de les cartes de les quals disposa el taulell
    for (var i = 0; i < (nFiles * nColumnes / 2); i++) {
        var randomIndex = Math.floor(Math.random() * cartesJoc.length);
        // Seleccionar la carta seleccionada de l'array de cartes
        cartesEscollides.push(cartesJoc.splice(randomIndex, 1)[0]); 
    }
    // Dupliquem les cartes seleccionades per formar les parelles
    return cartesEscollides.concat(cartesEscollides);
}

// Funci� per barrejar l'array de cartes
function barrejar(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

$(function () {
    ampladaCarta = $(".carta").width();
    alcadaCarta = $(".carta").height();
    // Mida del tauler
    $("#tauler").css({
        "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        "height": (nFiles * (alcadaCarta + separacioV) + separacioV) + "px"
    });

    // Funcio per barrejar l'array de cartes
    function barrejar(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    $("#contenidor").css({
        "width": (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
    });

    var cartesJoc = jocCartes();
    cartesJoc = barrejar(cartesJoc);

    var contador = 0;
    for (var f = 1; f <= nFiles; f++) {
        for (var c = 1; c <= nColumnes; c++) {
            contador++;
            var carta = $('<div class="carta" id="f' + f + 'c' + c + '"><div class="cara darrera"></div><div class="cara davant"></div></div>');
            carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
            });
            carta.find(".davant").addClass(cartesJoc[contador - 1]);
            $("#tauler").append(carta);
        }
    }

/*
    $(".carta").on("click", function () {
        $(this).toggleClass("carta-girada");

        nMaxClicks = 3 * nFiles * nColumnes;

        nClicks++;

        var elemento = document.getElementById("numclicks");
        elemento.innerHTML = nClicks + " / " + nMaxClicks; 

        if (nClicks == nMaxClicks) {
            handleTooManyClicks();
            
            // JanaB: Falta fer que l'últim click pot resoldre el joc
            // JanaB: Afegir possibilitat de fer nova partida
        }
    });
    */
   
    $('.carta').on('click', function () {
        // JBS: Anul·lem la crida a click()
        // click();

        // JBS: Crida a so "girar carta"
        reproduirSo_gircarta();

        // Comprovem si ja s'ha trobat parella per aquesta carta
        if ($(this).hasClass('parella-trobada') || $(this).hasClass('carta-girada') || cartesGirades >= 2) return;

        $(this).toggleClass('carta-girada');
        cartesGirades++;  

        // Controlem els clicks de l'usuari
        if (clicks === (3 * (nFiles * nColumnes))) {
            fiJoc();
        }
        
        //JBS: cartaAnterior inicialment tenia el valor "undefined"        
        if ((cartaAnterior === null) || (cartaAnterior === undefined)) {
            // Si no tenim cap carta seleccionada, hi guardem l'actual
            cartaAnterior = $(this);
            // alert ("Here01")
        } else {
            // alert ("99")
            // Comprovem si l'usuari ha clicat a la mateixa carta
            //alert(Object.is(cartaAnterior, null));
            // alert(cartaAnterior);
            // alert(cartaAnterior.find('.davant'));
             
            if (cartaAnterior.is($(this))) {
                // Si l'usuari ha clicat a la mateixa carta, no fem res
                // alert ("99b")
                return;
            }
            
            // Comprovem si fan parella
            //alert($(this).find('.davant').attr('class'))
            // alert ("100")
            if ($(this).find('.davant').attr('class') === cartaAnterior.find('.davant').attr('class')) {
                // Si son parella, marquem les cartes com a parella trobada
                
                // JBS: Crida a so "Parella"
                reproduirSo_parella();

                $(this).addClass('parella-trobada');
                cartaAnterior.addClass('parella-trobada');
                parella();
                cartaAnterior = null;
                cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                if (parelles === 0) {
                    fiJoc();
                }
            } else {
                // alert ("102")
                // Si no son parella, tornem a girar les cartes de nou
                setTimeout(() => {
                    $(this).toggleClass('carta-girada');
                    cartaAnterior.toggleClass('carta-girada');
                    cartaAnterior = null;
                    cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                }, 800);
            }
        }
    });

});

function handleTooManyClicks() {
        // Habilitar el botón modal
        $("#exampleModalButton").prop("disabled", false);
        // Mostrar el botón modal si está oculto
        $("#exampleModalButton").show();
}
    
    var parelles = (nFiles * nColumnes) / 2;
    document.getElementById("parelles").textContent = parelles;


    var cartesSeleccionades = null;
    var cartaAnterior = null;
    var cartesGirades = 0;
    var clicks = 0
/*
    $('.carta').on('click', function () {
        alert ("Here201")
        click();

        // Comprovem si ja s'ha trobat parella per aquesta carta
        if ($(this).hasClass('parella-trobada') || $(this).hasClass('carta-girada') || cartesGirades >= 2) return;

        $(this).toggleClass('carta-girada');
        cartesGirades++;  

        alert ("Here101")
        // Controlem els clicks de l'usuari
        if (clicks === (3 * (nFiles * nColumnes))) {
            fiJoc();
        }

        if (cartaAnterior === null) {
            // Si no tenim cap carta seleccionada, hi guardem l'actual
            cartaAnterior = $(this);
            alert ("Here01")
        } else {
            alert("Here02")
            // Comprovem si l'usuari ha clicat a la mateixa carta
            if (cartaAnterior.is($(this))) {
                // Si l'usuari ha clicat a la mateixa carta, no fem res
                return;
            }

            // Comprovem si fan parella
            alert($(this).find('.davant').attr('class'))
            if ($(this).find('.davant').attr('class') === cartaAnterior.find('.davant').attr('class')) {
                // Si son parella, marquem les cartes com a parella trobada
                $(this).addClass('parella-trobada');
                cartaAnterior.addClass('parella-trobada');
                parella();
                cartaAnterior = null;
                cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                if (parelles === 0) {
                    fiJoc();
                }
            } else {
                // Si no son parella, tornem a girar les cartes de nou
                setTimeout(() => {
                    $(this).toggleClass('carta-girada');
                    cartaAnterior.toggleClass('carta-girada');
                    cartaAnterior = null;
                    cartesGirades = 0; // Reiniciem el comptador de cartes girades en aquest torn
                }, 800);
            }
        }
    });
*/
    function parella() {
        parelles--;
 
        //JBS: "parelles" no estava definit al html
        document.getElementById("parelles").textContent = parelles;
    }
  
    function fiJoc() {
        alert("Joc finalitzat");
    }
  
    function click() {
        clicks++;
        document.getElementById("clicks").textContent = clicks;
    }

    var segons = -1;
    var minuts = 0;
    function setCounter() {
        segons++;
        if (segons === 60) {
            segons = 0;
            minuts++;
        }
        // Formatejem els minuts i els segons amb dos d�gits
        var minutosStr = minuts < 10 ? "0" + minuts : minuts;
        var segundosStr = segons < 10 ? "0" + segons : segons;
        var l = document.getElementById("contador");
        l.innerHTML = "Temps:" +  minutosStr + ":" + segundosStr;
    }
    function startCounter() {
        setCounter();
        setInterval(setCounter, 1000);
    }
    document.getElementById('low').addEventListener('click', startCounter);
    document.getElementById('medium').addEventListener('click', startCounter);
    document.getElementById('high').addEventListener('click', startCounter);

