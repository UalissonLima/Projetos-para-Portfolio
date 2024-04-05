const frm = document.querySelector('form')
const btnEditar = frm.querySelector('#btnEditar')
const btnExcluir = frm.querySelector('#btnExcluir')
const dataSelecinada = document.querySelector('#inDataSelecionada')
const CtnRegistros = document.querySelector('.container-registros')
const indices = {}
var pagReload = false

frm.addEventListener('submit', (e) => {
    e.preventDefault()

    const NomeExercicio = frm.inExercicio.value
    const Quilos = Number(frm.inQuilos.value)
    const Series = Number(frm.inSeries.value)
    const Repeticoes = Number(frm.inRepeticoes.value)
    const dataEscolhida = frm.inData.value
    
    const [Nome, Valores, Data] = criaElementoFaixa(NomeExercicio, Quilos, Series, Repeticoes, dataEscolhida)
    armazenaDados(Nome, Valores, Data)
    dataSelecinada.value = frm.inData.value
})

function armazenaDados(nome, valores, data){
    if(localStorage.getItem('Nome')){
        const dadosNome = localStorage.getItem('Nome') + ';' + nome
        const dadosValores = localStorage.getItem('Valores') + ';' + valores
        const dadosData = localStorage.getItem('Data') + ';' + data
        localStorage.setItem('Nome', dadosNome)
        localStorage.setItem('Valores', dadosValores)
        localStorage.setItem('Data', dadosData)
    } else {
        localStorage.setItem('Nome', nome)
        localStorage.setItem('Valores', valores)
        localStorage.setItem('Data', data)
    }
}

function criaElementoFaixa(NomeExercicio, Quilos, Series, Repeticoes, Data){
    const divFaixa = document.createElement('div')
    const pNome = document.createElement('p')
    const pValores = document.createElement('p')
    const txtNome = document.createTextNode(NomeExercicio)
    const txtValores = document.createTextNode(`${Quilos} Quilos ${Series} Series ${Repeticoes} Repetições`)
    const pData = document.createElement('p')

    pNome.appendChild(txtNome)
    pValores.appendChild(txtValores)
    if(pagReload){
        pData.appendChild(document.createTextNode(Data))
    } else {
        pData.appendChild(retornaDataFormatada(Data))
    }
    divFaixa.classList.add('container-faixa')
    divFaixa.style.display = 'block'

    mostraElementoFaixa(divFaixa, pNome, pValores, pData)
    
    resetaDatas()

    frm.inExercicio.focus()
    pagReload = false

    return [pNome.innerText, pValores.innerText, pData.innerText]
}

function mostraElementoFaixa(divFaixa, pNome, pValores, pData){
    CtnRegistros.appendChild(divFaixa)
    divFaixa.appendChild(pNome)
    divFaixa.appendChild(pValores)
    divFaixa.appendChild(pData)
}

function retornaDataFormatada(data){
    const dataCriacao = data.split('-')
    return document.createTextNode(`${dataCriacao[2]}/${dataCriacao[1]}/${dataCriacao[0]}`)
}

function retonaDataAtual(){
    const dia = new Date().getDay()
    const mes = new Date().getMonth() + 1
    const ano = new Date().getFullYear()
    const dataCompleta = ano + "-" + (mes < 10 ? "0" + mes : mes) + "-" + (dia < 10 ? "0" + dia : dia) 
    dataSelecinada.value = dataCompleta
    frm.inData.value = dataCompleta
    return dataCompleta
}

CtnRegistros.addEventListener('click', (e) => {
    const ckElemento = e.target.parentElement
    const vetorFaixas = CtnRegistros.querySelectorAll('.container-faixa')

    for (let i = 0; i < vetorFaixas.length; i++) {
        if (vetorFaixas[i] === ckElemento) {

            indices.editando = i;

            btnEditar.disabled = false
            btnExcluir.disabled = false
            const valores = vetorFaixas[i].children[1].innerText
            const data = vetorFaixas[i].children[2].innerText
            const vetorValores = valores.split(' ')

            editaData = true

            const dataCriacao = data.split('/')

            frm.inExercicio.value = vetorFaixas[i].children[0].innerText
            frm.inQuilos.value = vetorValores[0]
            frm.inSeries.value = vetorValores[2]
            frm.inRepeticoes.value = vetorValores[4]
            frm.inData.value = `${dataCriacao[2]}-${dataCriacao[1]}-${dataCriacao[0]}`
           
            break
        }
    }
})

btnEditar.addEventListener('click', () => {
    const NomeExercicio = frm.inExercicio.value
    const Quilos = Number(frm.inQuilos.value)
    const Series = Number(frm.inSeries.value)
    const Repeticoes = Number(frm.inRepeticoes.value)
    const Data = frm.inData.value
    const dataCriacao = Data.split('-')

    const ckElemento = CtnRegistros.querySelectorAll('.container-faixa')[indices.editando]
        
    ckElemento.children[0].innerText = NomeExercicio
    ckElemento.children[1].innerText = (`${Quilos} Quilos ${Series} Series ${Repeticoes} Repetições`)
    ckElemento.children[2].innerText = `${dataCriacao[2]}/${dataCriacao[1]}/${dataCriacao[0]}`



    editaButton = true
        
    alteraDados(indices.editando, ckElemento.children[0].innerText, ckElemento.children[1].innerText, ckElemento.children[2].innerText)

    resetaDatas()
    filtraData(Data)
    dataSelecinada.value = Data
    frm.inExercicio.focus()
    btnEditar.disabled = true
})

function alteraDados(indice, elementoNome, elementoValores, elementoData){
    const vetorNome = localStorage.getItem('Nome').split(';')
    const vetorValores = localStorage.getItem('Valores').split(';')
    const vetorData = localStorage.getItem('Data').split(';')

    vetorNome[indice] = elementoNome
    vetorValores[indice] = elementoValores
    vetorData[indice] = elementoData

    localStorage.removeItem('Nome')
    localStorage.removeItem('Valores')
    localStorage.removeItem('Data')

    localStorage.setItem('Nome', vetorNome.join(';'))
    localStorage.setItem('Valores', vetorValores.join(';'))
    localStorage.setItem('Data', vetorData.join(';'))
}

btnExcluir.addEventListener('click', () => {
    const ckElemento = CtnRegistros.querySelectorAll('.container-faixa')[indices.editando]
    CtnRegistros.removeChild(ckElemento)

    const vetorNome = localStorage.getItem('Nome').split(';')
    const vetorValores = localStorage.getItem('Valores').split(';')
    const vetorData = localStorage.getItem('Data').split(';')

    vetorNome.splice(indices.editando, 1)
    vetorValores.splice(indices.editando, 1)
    vetorData.splice(indices.editando, 1)

    localStorage.removeItem('Nome')
    localStorage.removeItem('Valores')
    localStorage.removeItem('Data')

    localStorage.setItem('Nome', vetorNome.join(';'))
    localStorage.setItem('Valores', vetorValores.join(';'))
    localStorage.setItem('Data', vetorData.join(';'))

    frm.reset()
    btnEditar.disabled = true
    btnExcluir.disabled = true
})

window.addEventListener('load', () => {
    if(localStorage.getItem('Nome')){
        const vetorNome = localStorage.getItem('Nome').split(';')
        const vetorValores = localStorage.getItem('Valores').split(';')
        const vetorDatas = localStorage.getItem('Data').split(';')

        for(let i = 0; i < vetorNome.length; i++){
            pagReload = true
            vetorNome[i]
            const valoresSeparados = vetorValores[i].split(' ')

            criaElementoFaixa(vetorNome[i], valoresSeparados[0], valoresSeparados[2], valoresSeparados[4], vetorDatas[i])
        }
    }
    const dataAtual = retonaDataAtual()
    filtraData(dataAtual)
})

dataSelecinada.addEventListener('change', (e) => {
    const changeData = e.target.value
    filtraData(changeData)
})

function filtraData(changeData){
    const dataCriacao = changeData.split('-')
    const dataFormata = `${dataCriacao[2]}/${dataCriacao[1]}/${dataCriacao[0]}`

    const vetorFaixas = CtnRegistros.querySelectorAll('.container-faixa')

    for(let i = 0; i < vetorFaixas.length; i++){
        const dataElemento = vetorFaixas[i].lastChild.innerText

        if(dataElemento !== undefined && dataElemento === dataFormata){
            vetorFaixas[i].style.display = 'block'
        } else {
            vetorFaixas[i].style.display = 'none'
            
        }
    }
}

function resetaDatas(){
    filtraData(frm.inData.value)
    frm.inRepeticoes.value = ''
    frm.inSeries.value = ''
    frm.inQuilos.value = ''
    frm.inExercicio.value = ''
}
