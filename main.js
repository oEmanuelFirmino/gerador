const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function mostrarSelect() {
    const checkbox = document.querySelector("#pagamento");
    const selectContainer = document.querySelector("#selectContainer");

    if (checkbox.checked) {
        selectContainer.style.display = "block";
    } else {
        selectContainer.style.display = "none";
    }
}


function padronizarValor(valor) {
    const valorLimpo = valor.replace(/[^0-9,]/g, '');
    const valorComPonto = valorLimpo.replace(',', '.');
    const valorFormatado = parseFloat(valorComPonto).toFixed(2);
    return `R$ ${valorFormatado.replace('.', ',')}`;
}

function gerarCodigoAutenticacao() {
    const caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let codigo = '';

    for (let i = 0; i < 16; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }

    return codigo;
}

function preencherDataAtual() {
    const dataInput = document.querySelector("#data");
    const dataAtual = new Date().toISOString().split('T')[0];
    dataInput.value = dataAtual;
}

function gerarPdf() {

    const nomePagador = document.querySelector("#nomePagador").value;

    const data = document.querySelector("#data").value.toString();
    const valor = padronizarValor(document.querySelector("#valor").value);
    const codigoAutenticacao = gerarCodigoAutenticacao();

    const checkbox = document.querySelector("#pagamento");
    const mesReferente = checkbox.checked ? document.querySelector("#mesReferente").value : null;

    const mesReferenteTexto = mesReferente ? meses[parseInt(mesReferente) - 1] : null;


    var doc = new jsPDF();

    // Adiciona um retângulo branco como plano de fundo
    doc.setFillColor(255, 255, 255); // Branco
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Adiciona uma tarja azul no cabeçalho
    doc.setFillColor(33, 53, 73); // Azul escuro
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    // Adiciona o texto "Pagamento realizado" no cabeçalho
    doc.setTextColor(255, 255, 255); // Branco
    doc.setFontSize(16);
    doc.text("Pagamento realizado", doc.internal.pageSize.width / 2, 15, { align: 'center' });

    // Adiciona a data centralizada, em negrito e sem título
    doc.setFontSize(18);
    doc.setFontType('bold');
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(data, doc.internal.pageSize.width / 2, 45, { align: 'center' });
    doc.setFontType('normal');

    // Adiciona os demais campos
    adicionarLinhaEstilizada(doc, "Valor", 70, valor);
    adicionarLinhaEstilizada(doc, "Documento", 80, "Comprovante de pagamento");

    // Adiciona uma linha horizontal
    doc.setDrawColor(33, 53, 73); // Cor da linha
    doc.line(10, 95, doc.internal.pageSize.width - 10, 95);

    adicionarLinhaEstilizada(doc, "Pagador", 105, nomePagador);
    adicionarLinhaEstilizada(doc, "Recebedor", 115, "Joyce de Souza Coelho Alves")

    if (mesReferente) {
        adicionarLinhaEstilizada(doc, "Pagamento referente a", 90, mesReferenteTexto);
    }

    // Adiciona o código de autenticação no rodapé
    doc.setFontSize(12);
    doc.text(`Código de Autenticação: ${codigoAutenticacao}`, 10, doc.internal.pageSize.height - 10);

    const nomeDoArquivo = `${nomePagador}_${data}`;
    doc.save(`${nomeDoArquivo}.pdf`);
}

function adicionarLinhaEstilizada(doc, titulo, y, texto) {
    // Adiciona título mais claro
    doc.setTextColor(33, 53, 73); // Azul escuro
    doc.setFontSize(14);
    doc.text(titulo, 10, y);

    // Restaura a cor do texto para preto
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(texto, 80, y);
}
