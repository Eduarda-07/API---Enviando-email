
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { networkInterfaces } = require("os");


const modelBanco = require("./model/DAO/recuperarSenha")

function gerarCodigoSeguro() {
    return crypto.randomBytes(3).toString('hex')
}


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mesaplus.oficial@gmail.com",
        pass: "jtxu zchr mbzm mwup"
    }
})


async function enviarEmailRecuperacao(destinatarioEmail, tipo) {
    
   
    const codigo = gerarCodigoSeguro()

    console.log(`Gerando código seguro para: ${destinatarioEmail}`)

    let resultModel = await modelBanco.guardarCodigo(destinatarioEmail,codigo, tipo)


    if (!resultModel) {
        console.error(`Falha ao salvar o código no banco para o email: ${destinatarioEmail}`);
        // Retorna falha antes de tentar enviar o email
        return { success: false, message: "Falha ao salvar o código no banco de dados." };
    }

    try {
        let info = await transporter.sendMail({
            from: "Mesa Plus <mesaplus.oficial@gmail.com>",
            to: destinatarioEmail,
            subject: "Recuperação de Senha - Código de Verificação",
         
            text: `Este é um email que não precisa ser respondido. Segue código de verificação para recuperar senha.`,
            html: `
                <p>Olá!</p>
                <p>Seu código de verificação para redefinição de senha é:</p>
                <h2 style="color: #007bff; background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">${codigo}</h2>
                <p><strong>Por motivos de segurança, este código expirará em 15 minutos.</strong></p>
            `
        });

        console.log("Email enviado com sucesso");
        
        return { success: true, codigo: codigo }; 
        
    } catch (error) {
        console.error("Erro ao enviar o email:", error);
        return { success: false, error: error.message };
    }
}

// (async () => {
//     const destinatarioEmail = "lhsantos198@gmail.com";
//     const tipo = "pessoa";
//     const resultado = await enviarEmailRecuperacao(destinatarioEmail, tipo);
//     console.log("Resultado final da operação:", resultado);
// })();

// enviarEmailRecuperacao(destinatarioEmail)

module.exports = {
    enviarEmailRecuperacao
};