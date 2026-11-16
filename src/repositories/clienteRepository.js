import { createRecord, deleteRecord, listRecords, updateRecord } from '../utils/inMemoryData.js';

const clienteRepository = {
    criar: async (cliente) => {
        const resultado = createRecord('clientes', {
            nome: cliente.nome,
            cpf: cliente.cpf,
            cep: cliente.cep,
            logradouro: cliente.logradouro,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            uf: cliente.uf,
            numero: cliente.numero,
            complemento: cliente.complemento,
            dataCad: new Date().toISOString()
        });
        return resultado;
    },
    editar: async (cliente) => {
        const resultado = updateRecord('clientes', cliente.id, {
            nome: cliente.nome,
            cpf: cliente.cpf,
            cep: cliente.cep,
            logradouro: cliente.logradouro,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            uf: cliente.uf,
            numero: cliente.numero,
            complemento: cliente.complemento
        });
        if (!resultado) {
            return { affectedRows: 0 };
        }
        return resultado;
    },
    deletar: async (id) => {
        return deleteRecord('clientes', id);
    },
    selecionar: async () => {
        return listRecords('clientes');
    }
};

export default clienteRepository;