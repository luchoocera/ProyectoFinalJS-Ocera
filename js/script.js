//Clases para instanciar:

class Ingreso {
    constructor(nombre, valor, tipo){
        this.nombre = nombre
        this.valor = valor
        this.tipo = tipo
    }
}

class Presupuesto {
    constructor(tipo, valor, mes){
        this.tipo = tipo
        this.valor = valor
        this.mes = mes
    }
}

class Ahorro{
    constructor(tipo, valor, mes){
        this.tipo = tipo
        this.valor = valor
        this.mes = mes
    }
}

//Variables globales
let ingresosFijos = document.getElementById('ingresos-fijos-mensuales');
let gastosFijos = document.getElementById('gastos-fijos-mensuales');
let presupuestoObjetivoMensual = document.getElementById('presupuesto-objetivo-mensual');
let margenMensual = document.getElementById('margen-establecido-mensual');
let ahorroActual = document.getElementById('ahorro-actual');
let presupuestos = [];
let ahorros = [];

//Variables
//1. Categorizacion
let categorizacion = document.getElementById('categorizacion');
let botonCategorizacion = document.getElementById('boton-categorizacion');
let categorizacionRealizada = false;
//2. planificacion
let planificacion = document.getElementById('planificacion');
let presupuestoInicial = document.getElementById('presupuesto-inicial');
let botonPlanificacion = document.getElementById('boton-planificacion');

//3.Seguimiento de presupuesto
let estadoActualPresupuesto = document.getElementById('presupuesto-mensual-estado');
let presupuestoEstablecido = document.getElementById('presupuesto-mensual-establecido');
let registrarIngresoBoton = document.getElementById('registrar-ingreso-btn');
let registrarGastoBoton = document.getElementById('registrar-gasto-btn');

//4.Estado mensual del presupuesto
let vigenciaPresupuesto = document.getElementById('vigencia-presupuesto');

//5.Historico de presupuestos
let presupuestosHistorico = document.getElementById('presupuestos-historico');
let presupuestosHistoricoBoton = document.getElementById('presupuestos-historico-boton');
let historicoDesplegado = false;


//Eventos
botonCategorizacion.addEventListener('click', realizarCategorizacion);

function realizarCategorizacion(){

    let inputIngreso = document.getElementById('ingresos-fijos');
    let inputGasto = document.getElementById('gastos-fijos');
    let montoIngreso = parseFloat(inputIngreso.value);
    let montoGasto = parseFloat(inputGasto.value);
    
    if ((!isNaN(montoIngreso))&&(!isNaN(montoGasto))){
        ingresosFijos.innerText = montoIngreso;
        gastosFijos.innerText = montoGasto;

        categorizacionRealizada = true;
        presupuestoInicialDefinido = new Presupuesto ('Inicial', (montoIngreso-montoGasto), 'Agosto');
        presupuestos.push(presupuestoInicialDefinido);
        presupuestoInicial.innerText = (`Tu presupuesto inicial es: ${presupuestos[0].valor}`);
    }
    else{
        return alert ("Ingresaste un numero no valido")
    }
    console.log(presupuestos);
}


botonPlanificacion.addEventListener('click', realizarPlanificacion);

function realizarPlanificacion(){

    let inputPresupuestoDeseado = document.getElementById('presupuesto-deseado');
    let inputMargen = document.getElementById('margen-deseado');
    let montoPresupuestoDeseado = parseFloat(inputPresupuestoDeseado.value);
    let porcentajeMargen = parseFloat(inputMargen.value);

    if ((categorizacionRealizada == true)&&(!isNaN(montoPresupuestoDeseado))&&(!isNaN(porcentajeMargen))){
        //Creamos el presupuesto del mes y lo agregamos al array "presupuestos"
        let presupuestoObjetivo = new Presupuesto ('Objetivo', (montoPresupuestoDeseado + (presupuestos[0].valor * (porcentajeMargen/100))), 'Agosto');
        presupuestos.push(presupuestoObjetivo);
        presupuestoObjetivoMensual.innerText = `El presupuesto para el mes actual es: ${presupuestoObjetivo.valor}`
        margenMensual.innerText = `Margen actual: ${porcentajeMargen}%`

        //Creamos el ahorro mensual
        let ahorroObjetivo = new Ahorro ('Objetivo', (presupuestos[0].valor - presupuestoObjetivo.valor), 'Agosto');
        ahorros.push(ahorroObjetivo);
        let ahorroContenedor = document.createElement('div');
        ahorroContenedor.innerHTML = `<h3>Ahorro mensual</h3> 
                                      <h4>Tu ahorro inicial para este mes es: ${ahorroObjetivo.valor}</h4>`;
        planificacion.appendChild(ahorroContenedor);
    }
    else{
        return alert ("Ingresaste un numero no valido");
    }

    //Mostramos el estado actual del presupuesto y el mensual establecido
    let presupuestoActual = new Presupuesto ('Actual', (presupuestos[1].valor), 'Agosto')
    presupuestos.push(presupuestoActual);
    //Mostramos el presupuesto establecido
    presupuestoEstablecido.innerText = presupuestos[1].valor;
    actualizarEstadoActual();
}

//Registrar ingreso
registrarIngresoBoton.onclick = () => {

    let registrarIngresoInput = document.getElementById('registrar-ingreso-input');
    let nuevoIngreso = parseFloat(registrarIngresoInput.value);

    if(!isNaN(nuevoIngreso)){
        //Traemos el valor del estado actual del presupuesto y lo actualizamos
        let nuevoValorPresupuesto = (parseFloat(presupuestos[2].valor)) + nuevoIngreso;
        presupuestos[2].valor = nuevoValorPresupuesto;
        registrarIngresoInput.value = '';
        console.table(presupuestos[2]);
    }
    else{
        return alert ("Ingresaste un numero no valido");
    }

    actualizarEstadoActual();
}

//Registrar gasto
registrarGastoBoton.onclick = () => {

    let registrarGastoInput = document.getElementById('registrar-gasto-input');
    let nuevoGasto = parseFloat(registrarGastoInput.value);
    let valorPresupuestoActual = parseFloat(presupuestos[2].valor);

    if(!isNaN(nuevoGasto)&&((valorPresupuestoActual - nuevoGasto)>=0)){
        //Traemos el valor del estado actual del presupuesto y lo actualizamos
        let nuevoValorPresupuesto = valorPresupuestoActual - nuevoGasto;
        presupuestos[2].valor = nuevoValorPresupuesto;
        registrarGastoInput.value = '';
        console.table(presupuestos[2]);
    }
    else if(!isNaN(nuevoGasto)){

        Swal.fire({
            title: 'Advertencia',
            text: "Estas a punto de superar tu presupuesto establecido, deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
                let nuevoValorPresupuesto = valorPresupuestoActual - nuevoGasto;
                presupuestos[2].valor = nuevoValorPresupuesto;
                registrarGastoInput.value = '';
                console.table(presupuestos[2]);   
              Swal.fire(
                ':(',
                'Superaste tu presupuesto establecido para el mes',
                'success'
              )
            }
            actualizarEstadoActual();
          }) 
    }
    else if(isNaN(nuevoGasto)){
        return alert ("Ingresaste un numero no valido");
    }
    else{
        return alert ("Operacion cancelada");
    }
    actualizarEstadoActual();
}


//Funcion actualizarValorPresupuesto

function actualizarEstadoActual(){
    //Actualizamos el valor del presupuesto
    let valorActualizado = presupuestos[2].valor;
    estadoActualPresupuesto.innerText = valorActualizado;
    //Actualizamos la vigencia
    if(valorActualizado>0){
        vigenciaPresupuesto.innerHTML = `<h3 class="vigencia-si">Bien! actualmente te encontras cumpliendo el presupuesto</h3>`
    }
    else{
        vigenciaPresupuesto.innerHTML = `<h3 class="vigencia-no">Lamentablemente no estas cumpliendo el presupuesto actualmente</h3>`
    }
            //Actualizamos el ahorro restando la cantidad que superamos del presupuesto
            ahorroActual.innerText= ahorros[0].valor + valorActualizado;
}


//Historico de presupuestos

presupuestosHistoricoBoton.onclick = () => {

    if(!historicoDesplegado){
        const mostrarHistorico = async () => {
            let resp = await fetch('./presupuestos.json');
            let presupuestosJson = await resp.json();
            presupuestosJson.forEach(presupuestoJson => {
                presupuestosHistorico.innerHTML +=
                `<li> ${presupuestoJson.mes} - ${presupuestoJson.tipo}: ${presupuestoJson.valor} </li>`
            });
            presupuestosHistoricoBoton.innerHTML = "Ocultar historico"
            historicoDesplegado = true;
        }
        //Ejecuto la funcion
        mostrarHistorico();
    }
    else{
        presupuestosHistorico.innerHTML = "";
        presupuestosHistoricoBoton.innerHTML = "Mostrar historico"
        historicoDesplegado = false;
    }
}





