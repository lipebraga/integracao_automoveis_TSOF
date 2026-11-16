import { connection } from '../../src/configs/Database.js';


export class VeiculoFactory {
    static async create(modelo, placa, ano, cor, valor, idCliente, idMontadora) {
        const [result] = await connection.execute(
            `INSERT INTO veiculos (idMontadora, idCliente, modelo, placa, ano, cor, valor)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [idMontadora, idCliente, modelo, placa, ano, cor, valor]
        );


        return {
            id: result.insertId,
            modelo,
            placa,
            ano,
            cor,
            valor,
            idCliente,
            idMontadora
        };
    }
}