import { createRecord, deleteRecord, listRecords, updateRecord } from '../utils/inMemoryData.js';

const veiculoRepository = {
    criar: async (veiculo) => {
        const resultado = createRecord('veiculos', {
            idMontadora: veiculo.idMontadora,
            idCliente: veiculo.idCliente,
            modelo: veiculo.modelo,
            placa: veiculo.placa,
            ano: veiculo.ano,
            cor: veiculo.cor,
            valor: veiculo.valor,
            dataCad: new Date().toISOString()
        });
        return resultado;
    },
    editar: async (veiculo) => {
        const resultado = updateRecord('veiculos', veiculo.id, {
            idMontadora: veiculo.idMontadora,
            idCliente: veiculo.idCliente,
            modelo: veiculo.modelo,
            placa: veiculo.placa,
            ano: veiculo.ano,
            cor: veiculo.cor,
            valor: veiculo.valor
        });
        if (!resultado) {
            return { affectedRows: 0 };
        }
        return resultado;
    },
    deletar: async (id) => {
        return deleteRecord('veiculos', id);
    },
    selecionar: async () => {
        return listRecords('veiculos');
    }
};

export default veiculoRepository;