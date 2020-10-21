new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },
        atacar: function () {
            let ataque = this.calcularHeridas(this.rangoAtaque);// Math.ceil(Math.random()*10);
            
            this.saludMonstruo = (this.saludMonstruo-ataque < 0? 0 : this.saludMonstruo-ataque);
            
            this.turnos.unshift({
                esJugador: true,
                text: 'Golpeaste al monstruo en ' + ataque + '%'
            });
            
            if (this.verificarGanador()) {
                return;
            }
            
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            let ataque = this.calcularHeridas( this.rangoAtaqueEspecial ); //Math.ceil(Math.random()*20);
            
            this.saludMonstruo = (this.saludMonstruo-ataque < 0? 0 : this.saludMonstruo-ataque);
            let evento = {
                esJugador: true,
                text: 'Golpeaste duro al monstruo por ' + ataque + '%'
            }

            this.registrarEvento(evento)
            if (this.verificarGanador()) {
                return;
            }
            
            this.ataqueDelMonstruo();
            
        },

        curar: function () {
            const PORCENTAJE_CURACION = 10;
            let saludDelJugadorAntesDelAtaque = this.saludJugador
            
            this.ataqueDelMonstruo();

            if (saludDelJugadorAntesDelAtaque <= 90) {
                this.saludJugador += PORCENTAJE_CURACION;
                let evento = {
                    esJugador: true,
                    text: 'Te curaste en un ' + PORCENTAJE_CURACION + '%',
                }
                this.registrarEvento(evento)
            }
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            let ataque = this.calcularHeridas( this.rangoAtaqueDelMonstruo );//Math.ceil(Math.random()*12);
            
            this.saludJugador = (this.saludJugador-ataque < 0? 0 : this.saludJugador-ataque);

            let evento = {
                esJugador: false,
                text: 'El monstruo golpea por  ' + ataque + '%'
            }

            this.registrarEvento(evento);
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            let min = rango[0]
            let max = rango[1]
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        verificarGanador: function () {
            if( this.saludMonstruo <= 0){
                if( confirm('Ganaste! Queres Jugar de Nuevo?') ){
                    this.empezarPartida();
                }else{
                    this.terminarPartida();
                }
                return true;
            }else if( this.saludJugador <= 0){
                if( confirm('Perdiste! Queres Jugar de Nuevo?') ){
                    this.empezarPartida();
                }else{
                    this.terminarPartida();
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});