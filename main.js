const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function preencherDataAtual() {
    const dataInput = document.querySelector("#data");
    const dataAtual = new Date().toISOString().split('T')[0];
    dataInput.value = dataAtual;
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

function gerarPdf() {
    const nomePagador = document.querySelector("#nomePagador").value;
    const data = document.querySelector("#data").value.toString();
    const valor = padronizarValor(document.querySelector("#valor").value);
    const codigoAutenticacao = gerarCodigoAutenticacao();

    const mesesSelecionados = Array.from(document.querySelectorAll("#mesesPagos input:checked"))
        .map(checkbox => checkbox.value)
        .join(", ");

    const doc = new jsPDF();

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
    adicionarLinhaEstilizada(doc, "Documento", 85, "Comprovante de pagamento");

    // Adiciona uma linha horizontal
    doc.setDrawColor(33, 53, 73); // Cor da linha
    doc.line(10, 95, doc.internal.pageSize.width - 10, 95);

    adicionarLinhaEstilizada(doc, "Pagador", 100, nomePagador);
    adicionarLinhaEstilizada(doc, "Valor pago", 112.5, valor);
    adicionarLinhaEstilizada(doc, "Referente", 125, mesesSelecionados);

    // Adiciona outra linha horizontal
    doc.setDrawColor(33, 53, 73); // Cor da linha
    doc.line(10, 135, doc.internal.pageSize.width - 10, 135);

    // Adiciona o código de autenticação com fonte menor
    doc.setFontSize(10);
    doc.text("Autenticação", 10, 145);
    doc.setFontSize(16);
    doc.text(codigoAutenticacao, 10, 153);

    // Remove caracteres inválidos do nome do pagador para usá-lo no nome do arquivo
    const nomeArquivoSeguro = nomePagador.replace(/[^a-zA-Z0-9]/g, '_');

    doc.save(`${nomeArquivoSeguro}-${data}.pdf`);
}

function adicionarLinhaEstilizada(doc, titulo, y, valor) {
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Cinza para o título
    doc.text(titulo, 10, y);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Preto para o valor
    doc.text(valor, 10, y + 5);
}
