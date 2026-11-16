import { Montadora } from "../models/Montadora.js";
import montadoraRepository from "../repositories/montadoraRepository.js";

const normalizeText = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const isValidationError = (error) => {
    if (!error || !error.message) return false;
    const mensagem = normalizeText(error.message);
    return /inval|obrig|required|falt/.test(mensagem);
};

const montadoraController = {
    criar: async (req, res) => {
        try {
            const { nome, pais } = req.body;
            const montadora = Montadora.criar({ nome, pais });
            const resultado = await montadoraRepository.criar(montadora);
            res.status(201).json({
                message: "Montadora criada com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: "Erro ao criar montadora",
                error: error.message
            });
        }
    },
    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { nome, pais } = req.body;
            const montadora = Montadora.editar({ nome, pais }, id);
            const resultado = await montadoraRepository.editar(montadora);

            if (resultado && resultado.affectedRows === 0) {
                return res.status(404).json({
                    message: "Montadora não encontrada",
                    data: {}
                });
            }

            res.status(200).json({
                message: "Montadora atualizada com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: "Erro ao atualizar montadora",
                error: error.message
            });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await montadoraRepository.deletar(id);

            if (resultado && resultado.affectedRows === 0) {
                return res.status(404).json({
                    message: "Montadora não encontrada",
                    data: {}
                });
            }

            res.status(200).json({
                message: "Montadora deletada com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            const status = isValidationError(error) ? 400 : 500;
            res.status(status).json({
                message: "Erro ao deletar montadora",
                error: error.message
            });
        }
    },
    selecionar: async (req, res) => {
        try {
            const resultado = await montadoraRepository.selecionar();
 
            res.status(200).json({
                message: "Montadoras selecionadas com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao selecionar montadoras",
                error: error.message
            });
        }
    }
};

export default montadoraController;