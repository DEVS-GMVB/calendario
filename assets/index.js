const incluirReuniao = () => {

    let timestampCombo = getTimestamp();
    let
        data_reuniao = document.getElementById("dataReuniao").value,
        sala = document.getElementById("sala").value,
        hora_reuniao = document.getElementById("hora_inicio").value,
        hora_fim = document.getElementById("hora_fim").value,
        setor = document.getElementById("setor").value,
        responsavel = document.getElementById("responsavel").value,
        tema = document.getElementById("tema").value

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "data_reuniao": data_reuniao,
        "hora_reuniao": hora_reuniao,
        "hora_fim": hora_fim,
        "sala": sala,
        "setor": setor,
        "responsavel": responsavel,
        "tema": tema,
        "timestamp_inicio": timestampCombo.inicio_reuniao,
        "timestamp_fim": timestampCombo.fim_reuniao
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/user/agenda/reunioes", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result[1]))//se for true foi ccriado se for false ja tem um horaio igual
        .catch(error => console.log('error', error));

}


const buscarHorariosPorSala = () => {

    let
        data_reuniao = document.getElementById("dataReuniao").value,
        sala = document.getElementById("sala").value

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "data_reuniao": data_reuniao,
        "sala": sala
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/user/agenda/verify", requestOptions)
        .then(response => response.json())
        .then(function (data) {

            let
            sala = document.getElementById("sala").value
            dia = document.getElementById("dataReuniao").value
            let reservados = document.getElementById("reservados");
            let i = 0;
            while (i < data.length) {

                reservados.innerHTML += data[i].hora_reuniao + " ás "
                reservados.innerHTML += data[i].hora_fim + "<br>"
                let timestampInicio = data[i].timestamp_inicio,
                    timestampfim = data[i].timestamp_fim,
                    dataR = data[i].data_reuniao,
                    local = data[i].sala

                let timestampCombo = getTimestamp();
                let tEscolhidoInicio = timestampCombo.inicio_reuniao;
                let tEscolhidoFim = timestampCombo.fim_reuniao;

                if (dia == dataR && sala == local && (timestampInicio == tEscolhidoInicio)) {
                    console.log("data e sala iguais e inicio igual")
                }
                if (dia == dataR && sala == local && (timestampfim == tEscolhidoFim)) {
                    console.log("data e sala iguais e fim igual")
                }
                if (dia == dataR && sala == local && (tEscolhidoInicio > timestampInicio && tEscolhidoInicio < timestampfim)) {
                    console.log("inicio no meio de uma reuniao")
                }
                if (dia == dataR && sala == local && (tEscolhidoFim > timestampInicio && tEscolhidoFim < timestampfim)) {
                    console.log("fim no meio de uma reunião")
                }
                if (dia == dataR && sala == local && (tEscolhidoInicio < timestampInicio && tEscolhidoFim > timestampfim)) {
                    console.log("existe uma reunião no meio desse horário")
                }
                if (tEscolhidoInicio > tEscolhidoFim){
                    console.log("horário Inválido")
                }

                i++;
            }
        })
        .catch(error => console.log('error', error));
}


const getTimestamp = () => {

    let data_escolhida = document.getElementById("dataReuniao").value;
    let nova_data = data_escolhida.split("-");
    let hora_inicial_escolhida = document.getElementById("hora_inicio").value;
    let nova_hora = hora_inicial_escolhida.split(":");
    let hora_final_escolhida = document.getElementById("hora_fim").value;
    let nova_hora_final = hora_final_escolhida.split(":");
    let mes = parseInt(nova_data[1]);
    nova_data[1] = mes - 1;
    let data_inicio = new Date(...nova_data, ...nova_hora);
    let data_fim = new Date(...nova_data, ...nova_hora_final);
    let inicio_reuniao = data_inicio.getTime();
    let fim_reuniao = data_fim.getTime();

    return {
        inicio_reuniao,
        fim_reuniao
    }

}
//ao clicar na data ja colocar data clicada no input
//ao clicar em salvar só incluir se não tiver conflito 
//responder ao usuario se foi salvo  ou não 
//apagar inner html de horarios indisponiveis anteriores
