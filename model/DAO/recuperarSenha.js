/************************************************************************************************
 * Objetivo: criar a comunicação com o banco de dados, para fazer o CRUD de ongs
 * Data: 16/09/25
 * Autor: Eduarda Silva
 * Versão: 1.1
 ************************************************************************************************/

// import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

// instancia a biblioteca do prisma/client
const prisma = new PrismaClient()

// Função para atualizar o campo de código no banco e definir o tempo de expiração
const guardarCodigo = async function(email, codigo, tipo){
    try {
        // Calcula o tempo de expiração: Agora + 15 minutos (900 segundos)
        
        const tempo = new Date(Date.now() + 1000 * 60 * 15) // Expira em 15 minutos
        let tipoUsuario = ""
        
        if (tipo === 'pessoa'){
            tipoUsuario = 'tbl_usuarios'
        
        }else if (tipo === 'empresa') {
            tipoUsuario = 'tbl_empresas'
        }else if (tipo === 'ong') {
            tipoUsuario = 'tbl_ongs'
         }else {
            return false // Tipo inválido
        }
        console.log(tipo);
        const sql = `UPDATE ${tipoUsuario} SET codigo_recuperacao = '${codigo}',
                     codigo_expiracao = '${tempo.toISOString().slice(0, 19).replace('T', ' ')}'
                     WHERE email = '${email}'`
        
        const result = await prisma.$executeRawUnsafe(sql)

        return result === 1
    } catch (error) {
        console.log("Erro ao salvar código!!!!!:", error);
        return error; 
    }
}

// Função para buscar o token e o tempo de expiração de um usuário pelo email
const getTokenByEmail = async function(email, tipo){
    try {
        let tipousuario;
        if (tipo === 'pessoa') {
            tipousuario = 'tbl_usuarios'
        } else if (tipo === 'empresa') {
            tipousuario = 'tbl_empresas'
        } else if (tipo === 'ong') {
            tipousuario = 'tbl_ongs'
        } else {
            return false
        }

        const sql = `
            SELECT codigo_recuperacao, codigo_expiracao
            FROM ${tipousuario}
            WHERE email = '${email}'
        `;

        const result = await prisma.$queryRawUnsafe(sql);
        
        // Retorna o primeiro (e único) resultado se houver
        if (result && result.length > 0) {
            return result[0];
        } else {
            return null; // Email não encontrado
        }

    } catch (error) {
        console.error("Erro ao buscar token:", error);
        return false;
    }
}

// Função para limpar o token após o uso (segurança)
const deleteToken = async (email, tipo) => {
    try {
        let tableName;
        if (tipo === 'pessoa') {
            tableName = 'tbl_usuarios';
        } else if (tipo === 'empresa') {
            tableName = 'tbl_empresas';
        } else if (tipo === 'ong') {
            tableName = 'tbl_ongs';
        } else {
            return false; // Tipo inválido
        }

        const sql = `
            UPDATE ${tableName}
            SET token_recuperacao = NULL,
                token_expiracao = NULL
            WHERE email = '${email}'
        `;

        const result = await prisma.$executeRawUnsafe(sql);
        return result === 1; // Retorna true se uma linha foi afetada

    } catch (error) {
        console.error("Erro ao deletar token:", error);
        return false;
    }
}


module.exports = {
    guardarCodigo,
    getTokenByEmail,
    deleteToken 
}