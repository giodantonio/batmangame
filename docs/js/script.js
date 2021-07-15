let seleccionadas = [];
let aciertos = 0;
let intentos = 0;
let verificador = false;
let cartas = [];
let inicio2;
let formato;
let interval;

$(document).ready(function () {

    $('#btn-play').click(function () {
        
        $('#principal').fadeOut(3000, cargarSonido("./media/batman-intro.mp3"), function(){
            $('#game').fadeIn('1000', function() {
                iniciarConteo();
            });
        });
    });

    if(localStorage.getItem('topTime') !== null) {
        let rcd = localStorage.getItem('topTime');
        $('#record').text(rcd);
    }

    crearTablero();

    $('.container-card').click(comenzarPartida, function() {
        comenzarPartida(this);
    });

    $('#reiniciar').click(function () {
        detenerTiempoPartida(interval);
        intentos = 0;
        aciertos = 0;
        seleccionadas = [];
        $("#aciertos").text(aciertos);
        $('#intentos').text(intentos);
        $('#time').text('00:00:00');

        // Se elimina el contenido del tablero
        $('#fila').remove();

        // Se crea un nuevo tablero
        crearTablero();

        $('.container-card').click(function() {
            comenzarPartida(this);

        });
    });

});

function cargarSonido(src) {
    $('#audios')
        .prepend($(`<audio src="${src}" autoplay class="d-none">`)
    );
}

function iniciarTiempoPartida() {
    // Se inicia el contador del juego
    let h =0;
    let m =0;
    let s =0;
    if (verificador != true) {
        inicio2 = new Date();
        interval = setInterval(() => {
            ahora = new Date();
            transcurrido = ahora.getTime() - inicio2.getTime();
            if(transcurrido > 999) { s++; }
            if(s > 59) { m++; s= 0; }
            if(m > 59) { h++; m= 0; }
            if(h > 24) { h= 0; }
            let st = ('0' + s).slice(-2);
            let mt = ('0' + m).slice(-2);
            let ht = ('0' + h).slice(-2);
            formato = `${ht}:${mt}:${st}`;
            $('#time').text(formato);
        }, 1000);
        verificador = true;
    }
}

// Funciones del cronometro
function iniciarConteo() {
    contSeg = 5;
    timer = window.setInterval ( () => {
        $('#init').text(contSeg--);

        if(contSeg == 0) {
            window.clearInterval(timer);
            $('#overlay').fadeOut(3000);
        }
    }, 1000);
}

function cargarCartas() {
    cartas = [
        "./images/sideb_1.png",
        "./images/sideb_2.png",
        "./images/sideb_3.png",
        "./images/sideb_4.png",
        "./images/sideb_5.png",
        "./images/sideb_6.png",
        "./images/sideb_7.png",
        "./images/sideb_8.png"
    ];
}

function crearTablero() {
    cargarCartas();
    let tarjetas = [];
    for (let c = 0; c < 16; c++) {
        tarjetas.push(`
            <td class="container-card px-0 col-3">
                <div class="card-g">
                    <div class="side back">
                        <img class="img-size img-fluid" src="${cartas[0]}" alt="">
                    </div>
                    <div class="side front">
                        <img class="img-size img-fluid" src="./images/sidea.png" alt="">
                    </div>
                </div>
            </td>
        `);
        if(c%2==1) {
            cartas.splice(0,1);
        }

    }
    // Se desordena el arreglo de las tarjetas creadas
    tarjetas.sort(() => Math.random()-0.5);
    // se agregan todas las cartas
    $('table')
        .append($(`<tr id="fila" class="p-2 w-100 gx-0 row">`)
            .append(tarjetas)
        );
}

// Girar la cara de la carta
function voltearCartas(c) {
    let t = c;
    let tarj = $(t).children()[0];
    if($(tarj).css("transform") == "matrix(1, 0, 0, 1, 0, 0)") {
        $(tarj).css({"transform": "rotateY(180deg)"});
    }
    // Se agrega la carta a un array
    seleccionadas.push(c);
}

// Deselecciona las cartas (par)
function deseleccionarCartas() {
    // Se comparan las src para saber si son iguales
    
    let ob1 = $(seleccionadas).children()[0];
    ob1 = $(ob1).position();
    let p0 = $(seleccionadas).children()[0].children[0].children[0];
    let img0 = $(p0).attr('src');
    let ob2 = $(seleccionadas).children()[1];
    ob2 = $(ob2).position();
    let p1 = $(seleccionadas).children()[1].children[0].children[0];
    let img1 = $(p1).attr('src');

    if(img0 == img1) {
        if (ob1.top !== ob2.top || ob1.left !== ob2.left) {
            aciertos+=1;
             // Se muestra en pantalla el numero de aciertos
            $("#aciertos").text(aciertos);
            cargarSonido("./media/batman-acierto.mp3");
            // Mostrar alertar de acierto
            $('.alert1').fadeIn(10).fadeOut(3000);
            if(aciertos == 8) {
                detenerTiempoPartida(interval);
                // Se guarda el tiempo de la partida
                if(localStorage.getItem('topTime') !== null) {
                    let oldTime = localStorage.getItem('topTime');
                    // Si el tiempo de la nueva partida es menor que el almacenado se actualiza el valor
                    if(formato < oldTime) {
                        // Se notifica el nuevo record
                        $('#notificacion').toast('show');
                        localStorage.setItem('topTime', formato);
                        $('#record').text(formato);
                    }
                }else {
                    localStorage.setItem('topTime', formato);
                    $('#record').text(formato);
                }
                cargarSonido("./media/Batman-win.mp3");
                $('#modal').modal('show');
            }
            intentos++;
            seleccionadas = [];
        }else seleccionadas.pop();

    } else{
        // Mostrar un mensaje " fallaste"

        $('.alert2').fadeIn(10).fadeOut(3000, cargarSonido("./media/batman-errado.mp3"), function() {
            
            // Se voltean las cartas
            let carta1 = $(seleccionadas).children()[0];
            let carta2 = $(seleccionadas).children()[1];

            $(carta1).css({"transform": "rotateY(0)"});
            $(carta2).css({"transform": "rotateY(0)"});

            seleccionadas = [];
            intentos++;
            $('#intentos').text(intentos);
        });

    }
}

function comenzarPartida(c) {
    if(seleccionadas.length == 0 || seleccionadas.length == 1) {
        iniciarTiempoPartida();
        // Voltear la carta
        voltearCartas(c);
        // Deseleccionar las cartas cuando se han seleccionado 2
        if(seleccionadas.length == 2) {
            deseleccionarCartas();
            $('#intentos').text(intentos);
        }
    }
}


function detenerTiempoPartida(value) {
    if(verificador == true) {
        clearInterval(value);
        verificador = false;
    }
}


