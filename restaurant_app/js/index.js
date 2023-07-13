const btnGuardarCliente = document.querySelector('#guardar-cliente');

//guardar la informacion del cliente
let cliente = {
    mesa: '',
    hora: '',
    pedido:[]
}

const categorias = {
    1: 'Pizzas',
    2: 'Postres',
    3: 'Jugos',
    4: 'Comida',
    5: 'Cafe'
}

btnGuardarCliente.addEventListener('click',guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa,hora].some(campo => campo == '');
    
    //console.log(mesa,hora)

    if(camposVacios){
        //si los campos estan vacios
        //console.log('campos vacios');
        const existeAlerta = document.querySelector('.invalida');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalida','d-block','text-center')
            alerta.textContent = 'los campos no pueden estar vacios'
            document.querySelector('.modal-body form').appendChild(alerta)

            setTimeout(()=>{
                alerta.remove();
            },3000)
        }
    }else{
        console.log('campos llenos');
        cliente = {...cliente,mesa,hora};
    }

    //ocultar la venta modal despues de haber realizado el registro

    var modalFormulario = document.querySelector('#formulario');
    var modal = bootstrap.Modal.getInstance(modalFormulario);
    modal.hide();

    mostrarSeccion();
    obtenerMenu();

}

function mostrarSeccion(){
    const seccion = document.querySelectorAll('.d-none');
    //console.log(seccion);
    seccion.forEach(i=>i.classList.remove('d-none'))
}

function obtenerMenu(){
    const url = 'http://localhost:3000/menu'

    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado => mostrarMenu(resultado))
    .catch(error=>console.log(error))

}

function mostrarMenu(menu){

    //console.log('mostrarMenu');
    //console.log(menu);

    const contenido = document.querySelector('#menu .contenido');
    menu.forEach(menu=>{
        const fila = document.createElement('div');
        fila.classList.add('row','border-top');

        const nombre = document.createElement('div');
        nombre.textContent = menu.nombre;
        nombre.classList.add('col-md-3','py-3')
        fila.appendChild(nombre);

        const precio = document.createElement('div');
        precio.textContent = menu.precio;
        precio.classList.add('col-md-3','py-3')
        fila.appendChild(precio);

        const categoria = document.createElement('div');
        categoria.textContent = categorias[menu.categoria];
        categoria.classList.add('col-md-3','py-3')
        fila.appendChild(categoria);


        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;        
        inputCantidad.value = 0;
        inputCantidad.classList.add('form-control');
        inputCantidad.id = `producto - ${menu.id}`;
        inputCantidad.onchange = function(){
            const cantidad = parseInt (inputCantidad.value);
            console.log(cantidad);
            agregarOrden({...menu},cantidad);
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-2','py-3')
        agregar.appendChild(inputCantidad)
        fila.appendChild(agregar);
        //fila.appendChild(inputCantidad);


        contenido.appendChild(fila);
    })

   

}

function agregarOrden (producto, cont){
    console.log(producto);
    let {pedido} = cliente;
    console.log(pedido);

    if(cont > 0){
         console.log('producto', producto.id);
         console.log(pedido[1]);
         if(pedido.some(i=>i.id === producto.id)){
            //console.log('ingrese');
            const pedidoActualizado = pedido.map(item=>{
                if(item.id===producto.id){
                    item.cantidad = producto.cantidad;
                    //console.log(item.cantidad);
                }
                return i;
            });

            cliente.pedido = {...pedidoActualizado};

         }
    }else{
        //cantidad sea igual a 0
        console.log('cantidad', producto.cantidad);
        const resultado = pedido.filter(i => i !== producto.id)
        cliente.pedido = resultado
    }

    limpiarHTML();
     
    actualizarResumen();
       /* console.log(cliente.pedido.length);
    if(cliente.pedido.length){
        console.log('hay pedido');
        
    }else{
        mensajePedidoVacio();
        console.log('pedido vacio');
    }*/
}
function limpiarHTML(){
 const contenido = document.querySelector('#resumen .contenido')
 while(contenido.firstChild){
    contenido.removeChild(contenido.firstChild);
 }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido')
    const resumen = document.createElement('div')
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow')

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold')

    const mesaCliente = document.createElement('span');
    mesaCliente.textContent = cliente.mesa;
    mesaCliente.classList.add('fw-normal');
    mesa.appendChild(mesaCliente);

    const hora = document.createElement('span');
    mesaCliente.textContent = 'Mesa: ';
    hora.classList.add('fw-bold')

    const horaCliente = document.createElement('span');
    horaCliente.textContent = cliente.hora;
    horaCliente.classList.add('fw-normal');
    hora.appendChild(horaCliente)

    const heading = document.createElement('h3');
    heading.textContent = 'Pedidos';
    heading.classList.add('my-4');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(item=>{
        const { nombre,precio,cantidad,id} = item;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        //mostrar nombre
        const nombreP = document.createElement('h4')
        nombreP.classList.add('text-center','my-4')
        nombreP.textContent = nombre;

        //mostrar cantidad
        const cantidadP = document.createElement('p')
        cantidadP.classList.add('fw-bold')
        cantidadP.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('p')
        cantidadValor.classList.add('fw-normal')
        cantidadValor.textContent = cantidad ;

        const precioP = document.createElement('p')
        precioP.classList.add('fw-bold')
        precioP.textContent = 'Precio: ';

        const precioValor = document.createElement('p')
        precioValor.classList.add('fw-normal')
        precioValor.textContent = `$${precio}`

        const subtotalP = document.createElement('p')
        subtotalP.classList.add('fw-bold')
        subtotalP.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('p')
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularsubtotal(item);

        //boton para eliminar pedido
        const btnEliminar = document.createElement('button')
        btnEliminar.classList.add('btn','btn-danger')
        btnEliminar.textContent = 'Eliminar pedido';

        //agregar evento para eliminar el pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id);
        }

        cantidadP.appendChild(cantidadValor);
        precioP.appendChild(precioValor);
        subtotalP.appendChild(subtotalValor);

        lista.appendChild(nombreP);
        lista.appendChild(cantidadP);
        lista.appendChild(precioP);
        lista.appendChild(subtotalP);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);

    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    formularioPropinas();
}

function calcularsubtotal (item){
    const {cantidad,precio} = item;
    return `$${cantidad*precio}`;
}

function formularioPropinas (){
    const contenido = document.querySelector('#resumen .contenido')
    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6','formulario')

    const heading = document.createElement('h3')
    heading.classList.add('my-4')
    heading.textContent = 'Propina: ';

    const radio5 = document.createElement('input');
    radio5.type = 'radio';
    radio5.name = 'propina';
    radio5.value = '5';
    radio5.classList.add('form-check-input');
    radio5.onclick = calcularPropina

    const radioLabel5 = document.createElement('label');
    radioLabel5.textContent = '5%';
    radioLabel5.classList.add('form-check-label')

    const radioDiv5 = document.createElement('div')
    radioDiv5.classList.add('form-check');

    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina

    const radioLabel10 = document.createElement('label');
    radioLabel10.textContent = '10%';
    radioLabel10.classList.add('form-check-label')

    const radioDiv10 = document.createElement('div')
    radioDiv10.classList.add('form-check');


    radioDiv5.appendChild(radio5)
    radioDiv5.appendChild(radioLabel5)

    radioDiv10.appendChild(radio10)
    radioDiv10.appendChild(radioLabel10)

    formulario.appendChild(radioDiv5)
    formulario.appendChild(radioDiv10)
    contenido.appendChild(formulario)

}

function calcularPropina(){
    const radioSelect = parseInt (document.querySelector('[name="propina"]:checked').value);
    const{pedido} = cliente;

    let = subtotal = 0
    pedido.forEach(item =>{
        subtotal += item.cantidad * item.precio;
    })

    const divTotales = document.createElement('div')
    divTotales.classList.add('total-pagar');

    const propina = (subtotal * radioSelect)/100;
    const total = propina + subtotal;

    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3','fw-bold','mt-5');
    subtotalParrafo.textContent = 'Subtotal consumo: ';

    const subTotalP = document.querySelector('p');
    subTotalP.classList.add('fs-normal');
    subTotalP.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subTotalP);

    const propinaParrafo = document.createElement('span');
    propinaParrafo.classList.add('fs-normal');
    propinaParrafo.textContent = 'Propina: ';

    const propinaP = document.createElement('span');
    propinaP.classList.add('fs-normal');
    propinaP.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaP);

    const totalParrafo = document.createElement('p')
    totalParrafo.classList.add('fs-normal');
    totalParrafo.textContent= 'Total a pagar'
    
    const totalP = document.createElement('p');
    totalP.classList.add('fs-normal') 
    totalP.textContent = `$${total}`;

    totalParrafo.appendChild(totalP);
    const totalPagarDiv = document.querySelector('.total-pagar');

    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);

}

function eliminarProducto(id){
    const {pedido} = cliente;
    cliente.pedido = pedido.filter(i=>i.id !== id);

    limpiarHTML();

    if(cliente.padido.length){
        actualizarResumen();
    } else{

        mensajePedidoVacio();

    }
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}


function mensajePedidoVacio (){
    const contenido = document.querySelector('#resumen')
    const texto = document.createElement('p')
    texto.classList.add('test-center');
    texto.textContent = 'Debe agregar produtos al pedido'
    contenido.appendChild(texto);
}

