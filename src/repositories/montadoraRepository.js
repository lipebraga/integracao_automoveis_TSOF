import { createRecord, deleteRecord, listRecords, updateRecord } from '../utils/inMemoryData.js';

const montadoraRepository = {
    criar: async (montadora) => {
        const resultado = createRecord('montadoras', {
            nome: montadora.nome,
            pais: montadora.pais,
            dataCad: new Date().toISOString()
        });
        return resultado;
    },
    editar: async (montadora) => {
        const resultado = updateRecord('montadoras', montadora.id, {
            nome: montadora.nome,
            pais: montadora.pais
        });
        if (!resultado) {
            return { affectedRows: 0 };
        }
        return resultado;
    },
    deletar: async (id) => {
        return deleteRecord('montadoras', id);
    },
    selecionar: async () => {
        return listRecords('montadoras');
    }
};

export default montadoraRepository;