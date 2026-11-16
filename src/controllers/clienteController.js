import { Cliente } from "../models/Cliente.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { consultarCep } from "../utils/consultarCep.js";
import { limparNumero } from "../utils/limparNumero.js";

const normalizeText = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const isValidationError = (error) => {
    if (!error || !error.message) return false;
    const mensagem = normalizeText(error.message);
    return /inval|obrig|required|falt/.test(mensagem);
};

const clienteController = {
    criar: async (req, res) => {
        try {
            const { nome, cpf, cep, numero, complemento } = req.body;
            const dadosCep = await consultarCep(cep);
            const cliente = Cliente.criar({
                nome,
                cpf: limparNumero(cpf),
                cep: dadosCep.cep,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                numero,
                complemento
            });
            const resultado = await clienteRepository.criar(cliente);
            res.status(201).json({
                message: 'Cliente criado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: 'Erro ao criar cliente',
                error: error.message
            });
        }
    },
    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { nome, cpf, cep, numero, complemento } = req.body;
            const dadosCep = await consultarCep(cep);
            const cliente = Cliente.editar({
                nome,
                cpf: limparNumero(cpf),
                cep: dadosCep.cep,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                numero,
                complemento
            }, id);
            const resultado = await clienteRepository.editar(cliente);

            if (resultado && resultado.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado', data: {} });
            }

            res.status(200).json({
                message: 'Cliente atualizado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: 'Erro ao atualizar cliente',
                error: error.message
            });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await clienteRepository.deletar(id);

            if (resultado && resultado.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado', data: {} });
            }

            res.status(200).json({
                message: 'Cliente deletado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: 'Erro ao deletar cliente',
                error: error.message
            });
        }
    },
    selecionar: async (req, res) => {
        try {
            const resultado = await clienteRepository.selecionar();
            res.status(200).json({
                message: 'Clientes selecionados com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao selecionar clientes',
                error: error.message
            });
        }
    }
};

export default clienteController;