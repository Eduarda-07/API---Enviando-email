/****************************************************************************************************
 * Objetivo: controller responsável pela regra de negócio referente ao CROUD de ongs
 * Data: 16/09/25
 * Autor: Eduarda Silva
 * Versão: 1.0
 ***************************************************************************************************/

// import do arquivo de mensagens e status code o projeto
// const message = require('../../modulo/config.js')

const codigoDAO = require('../model/DAO/recuperarSenha')
const emailService = require('../index')


const enviarCodigo = async function(usuario, contentType){
    if(String(contentType).toLowerCase() != 'application/json'){
        return { status: 415, message: "Tipo de conteúdo não suportado." };
    }
    
    
    if ( 
        usuario.email === "" || usuario.email === undefined || usuario.email === null ||
        usuario.tipo === "" || usuario.tipo === undefined || usuario.tipo === null
    ) {
        return { status: 400, message: "Email e Tipo de usuário são obrigatórios." };
    }

    // 2. Chama o serviço de envio de email/token
    let result = await emailService.enviarEmailRecuperacao(usuario.email, usuario.tipo);

    if (result.success) {
        return { status_code: 200, message: "Código de recuperação enviado com sucesso!" };
    } else {
        // Erro pode vir do DAO (email não existe) ou do NodeMailer (conexão)
        return { 
            status_code: 500, 
            message: result.message || result.error || "Falha ao enviar o código." 
        };
    }
}

const consultarCodico = async function(usuario,contentType){
    if(String(contentType).toLowerCase() == 'application/json'){
        if ( 
            usuario.email      == ""  || usuario.email     == undefined  || usuario.email     == null   || usuario.email.length     > 100  ||
            usuario.tipo       == ""  || usuario.tipo      == undefined  || usuario.tipo      == null   ||
            usuario.codigo     == ""  || usuario.codigo    == undefined  || usuario.codigo    == null  
        ) {
            // return message.ERROR_REQUIRED_FIELD;
            return { status: 400, valido: false, message: "Campos obrigatórios ausentes." };
        }
    
        // 2. BUSCAR TOKEN NO BANCO DE DADOS
        const result = await codigoDAO.getTokenByEmail(email, tipo);
    
        // 3. TRATAMENTO DE ERROS NA BUSCA
        if (result === false) {
            // Erro interno no DAO
            // return message.ERROR_INTERNAL_SERVER_MODEL;
            return { status: 500, valido: false, message: "Erro interno ao buscar token." };
        }
        if (!result || !result.codigo_recuperacao) {
            // Email existe, mas não tem token ou token já foi usado
            return { status: 404, valido: false, message: "Token não encontrado ou inválido." };
        }
    
        const { codigo_recuperacao, codigo_expiracao } = result;
    
        // 4. VERIFICAÇÃO DE EXPIRAÇÃO
        const agora = new Date();
        const expiracao = new Date(token_expiracao);
    
        if (agora > expiracao) {
            // Token expirado: LIMPA O TOKEN e avisa o usuário
            await codigoDAO.deleteToken(email, tipo);
            return { status: 401, valido: false, message: "Código de verificação expirou. Solicite um novo." };
        }
    
        // 5. VERIFICAÇÃO DE IGUALDADE
        if (codigo === codigo_recuperacao) {
            // Token válido!
            return { status: 200, valido: true, message: "Código verificado com sucesso." };
        } else {
            // Token incorreto
            return { status: 401, valido: false, message: "Código de verificação inválido." };
        }
    }
   
}

module.exports = {
    consultarCodico,
    enviarCodigo
}