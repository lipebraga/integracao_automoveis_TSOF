import request from 'supertest';
import { describe, test, expect, afterAll } from 'vitest';
import app from '../app.js';

describe('Testes de Integração - API de Automóveis', () => {
    // Variáveis para armazenar IDs criados dinamicamente durante os testes
    let montadoraId;
    let clienteId;
    let veiculoId;


    describe('Montadoras', () => {
        test('CT-001: Cadastrar uma montadora com dados válidos', async () => {
            const novaMontadora = {
                nome: 'Toyota',
                pais: 'Japão',
            };

            const response = await request(app)
                .post('/montadoras')
                .send(novaMontadora);

            expect([200, 201]).toContain(response.status);
            expect(response.body).toBeDefined();

            // Captura o ID gerado para uso nos próximos testes (caso a API retorne o objeto ou o id)
            montadoraId = response.body.id || response.body.insertId || response.body.data?.id;

            // Valida se o novo registro aparece na listagem
            const listResponse = await request(app).get('/montadoras');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const criada = lista.find((m) => m.nome === 'Toyota' && m.pais === 'Japão');
            expect(criada).toBeDefined();
            if (!montadoraId && criada) {
                montadoraId = criada.id;
            }
        });

        test('CT-002: Listar montadoras cadastradas', async () => {
            const response = await request(app).get('/montadoras');

            expect(response.status).toBe(200);
            const lista = Array.isArray(response.body) ? response.body : response.body.data;
            expect(Array.isArray(lista)).toBe(true);
            expect(lista.length).toBeGreaterThan(0);
            expect(lista[0]).toHaveProperty('nome');
            expect(lista[0]).toHaveProperty('pais');
        });

        test('CT-003: Tentar cadastrar montadora com nome inválido', async () => {
            const montadoraInvalida = {
                nome: 'A',
                pais: 'Brasil',
            };

            const response = await request(app)
                .post('/montadoras')
                .send(montadoraInvalida);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();

            // Garante que nenhuma montadora com nome 'A' foi gravada
            const listResponse = await request(app).get('/montadoras');
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const encontrada = lista.find((m) => m.nome === 'A');
            expect(encontrada).toBeUndefined();
        });

        test('CT-011: Editar uma montadora já cadastrada', async () => {
            expect(montadoraId).toBeDefined();

            const dadosAtualizados = {
                nome: 'Toyota Motors',
                pais: 'Japão',
            };

            const response = await request(app)
                .put(`/montadoras?id=${montadoraId}`)
                .send(dadosAtualizados);

            expect([200, 204]).toContain(response.status);

            // Confirma a alteração na listagem
            const listResponse = await request(app).get('/montadoras');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const atualizada = lista.find((m) => m.id === montadoraId);
            expect(atualizada).toBeDefined();
            expect(atualizada.nome).toBe('Toyota Motors');
        });

        test('CT-012: Excluir uma montadora existente', async () => {
            // Cria uma montadora temporária exclusiva para exclusão (preservando a principal para os testes de veículos)
            const createRes = await request(app)
                .post('/montadoras')
                .send({ nome: 'Honda Temp', pais: 'Japão' });
            let tempId = createRes.body.id || createRes.body.insertId || createRes.body.data?.id;

            if (!tempId) {
                const list = await request(app).get('/montadoras');
                const arr = Array.isArray(list.body) ? list.body : list.body.data || [];
                tempId = arr.find((m) => m.nome === 'Honda Temp')?.id;
            }

            expect(tempId).toBeDefined();

            const deleteResponse = await request(app).delete(`/montadoras/${tempId}`);
            expect([200, 204]).toContain(deleteResponse.status);

            // Confirma que não está mais disponível na listagem
            const listResponse = await request(app).get('/montadoras');
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const removida = lista.find((m) => m.id === tempId);
            expect(removida).toBeUndefined();
        });

        test('CT-013: Tentar excluir uma montadora inexistente', async () => {
            const response = await request(app).delete('/montadoras/99999');

            expect([400, 404]).toContain(response.status);
            expect(response.body).toBeDefined();
        });
    });


    describe('Clientes', () => {
        test('CT-004: Cadastrar um cliente com dados válidos', async () => {
            const novoCliente = {
                nome: 'João da Silva',
                cpf: '12345678000',
                cep: '13185880',
                numero: '123',
                complemento: 'Casa',
            };

            const response = await request(app)
                .post('/clientes')
                .send(novoCliente);

            expect([200, 201]).toContain(response.status);
            expect(response.body).toBeDefined();

            clienteId = response.body.id || response.body.insertId || response.body.data?.id;

            // Valida se o cliente cadastrado aparece na listagem
            const listResponse = await request(app).get('/clientes');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const criado = lista.find((c) => c.cpf === '12345678000' || c.nome === 'João da Silva');
            expect(criado).toBeDefined();
            if (!clienteId && criado) {
                clienteId = criado.id;
            }
        });

        test('CT-005: Cadastrar cliente com CEP inválido', async () => {
            const clienteCepInvalido = {
                nome: 'Maria Souza',
                cpf: '98765432100',
                cep: '123',
                numero: '50',
                complemento: 'Sala 1',
            };

            const response = await request(app)
                .post('/clientes')
                .send(clienteCepInvalido);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-014: Editar um cliente já cadastrado', async () => {
            expect(clienteId).toBeDefined();

            const dadosAtualizados = {
                nome: 'João Silva Atualizado',
                cpf: '12345678000',
                cep: '13185880',
                numero: '456',
                complemento: 'Apto 2',
            };

            const response = await request(app)
                .put(`/clientes?id=${clienteId}`)
                .send(dadosAtualizados);

            expect([200, 204]).toContain(response.status);

            // Consulta novamente para confirmar os valores atualizados
            const listResponse = await request(app).get('/clientes');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const atualizado = lista.find((c) => c.id === clienteId);
            expect(atualizado).toBeDefined();
            expect(atualizado.nome).toBe('João Silva Atualizado');
            expect(String(atualizado.numero)).toBe('456');
        });

        test('CT-015: Excluir um cliente existente', async () => {
            // Cria um cliente temporário sem vínculos para testar a exclusão
            const createRes = await request(app)
                .post('/clientes')
                .send({
                    nome: 'Cliente Temporário',
                    cpf: '11122233344',
                    cep: '13185880',
                    numero: '99',
                    complemento: 'Fundos',
                });

            let tempId = createRes.body.id || createRes.body.insertId || createRes.body.data?.id;
            if (!tempId) {
                const list = await request(app).get('/clientes');
                const arr = Array.isArray(list.body) ? list.body : list.body.data || [];
                tempId = arr.find((c) => c.cpf === '11122233344')?.id;
            }

            expect(tempId).toBeDefined();

            const deleteResponse = await request(app).delete(`/clientes/${tempId}`);
            expect([200, 204]).toContain(deleteResponse.status);

            // Verifica remoção na listagem
            const listResponse = await request(app).get('/clientes');
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const removido = lista.find((c) => c.id === tempId);
            expect(removido).toBeUndefined();
        });

        test('CT-016: Listar clientes cadastrados', async () => {
            const response = await request(app).get('/clientes');

            expect(response.status).toBe(200);
            const lista = Array.isArray(response.body) ? response.body : response.body.data;
            expect(Array.isArray(lista)).toBe(true);
            expect(lista.length).toBeGreaterThan(0);
            expect(lista[0]).toHaveProperty('nome');
            expect(lista[0]).toHaveProperty('cpf');
        });

        test('CT-017: Tentar cadastrar cliente com nome inválido', async () => {
            const clienteNomeInvalido = {
                nome: 'A',
                cpf: '12345678000',
                cep: '13185880',
                numero: '10',
            };

            const response = await request(app)
                .post('/clientes')
                .send(clienteNomeInvalido);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();
        });
    });


    describe('Veículos', () => {
        test('CT-006: Cadastrar um veículo com dados válidos', async () => {
            const idMontadoraValido = montadoraId || 1;
            const idClienteValido = clienteId || 1;

            const novoVeiculo = {
                idMontadora: idMontadoraValido,
                idCliente: idClienteValido,
                modelo: 'Corolla',
                placa: 'ABC-1234',
                ano: 2022,
                cor: 'Prata',
                valor: 120000,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(novoVeiculo);

            expect([200, 201]).toContain(response.status);
            expect(response.body).toBeDefined();

            veiculoId = response.body.id || response.body.insertId || response.body.data?.id;

            // Verifica se aparece na listagem de veículos
            const listResponse = await request(app).get('/veiculos');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const criado = lista.find((v) => v.placa === 'ABC-1234');
            expect(criado).toBeDefined();
            if (!veiculoId && criado) {
                veiculoId = criado.id;
            }
        });

        test('CT-007: Tentar cadastrar veículo com valor inválido', async () => {
            const veiculoValorInvalido = {
                idMontadora: montadoraId || 1,
                idCliente: clienteId || 1,
                modelo: 'Corolla',
                placa: 'DEF-5678',
                ano: 2022,
                cor: 'Preto',
                valor: 0,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(veiculoValorInvalido);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();

            // Garante que o veículo inválido não foi gravado
            const listResponse = await request(app).get('/veiculos');
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const encontrado = lista.find((v) => v.placa === 'DEF-5678');
            expect(encontrado).toBeUndefined();
        });

        test('CT-008: Editar um veículo já cadastrado', async () => {
            expect(veiculoId).toBeDefined();

            const dadosAtualizados = {
                idMontadora: montadoraId || 1,
                idCliente: clienteId || 1,
                modelo: 'Corolla Cross',
                placa: 'ABC-1234',
                ano: 2023,
                cor: 'Branco',
                valor: 145000,
            };

            const response = await request(app)
                .put(`/veiculos?id=${veiculoId}`)
                .send(dadosAtualizados);

            expect([200, 204]).toContain(response.status);

            // Confere se a alteração foi salva via GET /veiculos
            const listResponse = await request(app).get('/veiculos');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const atualizado = lista.find((v) => v.id === veiculoId);
            expect(atualizado).toBeDefined();
            expect(atualizado.modelo).toBe('Corolla Cross');
            expect(atualizado.cor).toBe('Branco');
            expect(Number(atualizado.valor)).toBe(145000);
        });

        test('CT-010: Listar veículos cadastrados', async () => {
            const response = await request(app).get('/veiculos');

            expect(response.status).toBe(200);
            const lista = Array.isArray(response.body) ? response.body : response.body.data;
            expect(Array.isArray(lista)).toBe(true);
            expect(lista.length).toBeGreaterThan(0);
            expect(lista[0]).toHaveProperty('modelo');
            expect(lista[0]).toHaveProperty('placa');
            expect(lista[0]).toHaveProperty('ano');
            expect(lista[0]).toHaveProperty('cor');
            expect(lista[0]).toHaveProperty('valor');
        });

        test('CT-018: Tentar cadastrar veículo com ano inválido', async () => {
            const veiculoAnoInvalido = {
                idMontadora: montadoraId || 1,
                idCliente: clienteId || 1,
                modelo: 'Corolla',
                placa: 'GHI-9012',
                ano: 1800,
                cor: 'Azul',
                valor: 120000,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(veiculoAnoInvalido);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-019: Tentar cadastrar veículo com cliente inválido', async () => {
            const veiculoClienteInvalido = {
                idMontadora: montadoraId || 1,
                idCliente: 99999,
                modelo: 'Corolla',
                placa: 'JKL-3456',
                ano: 2022,
                cor: 'Prata',
                valor: 120000,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(veiculoClienteInvalido);

            expect([400, 404, 422, 500]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-020: Tentar cadastrar veículo com montadora inválida', async () => {
            const veiculoMontadoraInvalida = {
                idMontadora: 99999,
                idCliente: clienteId || 1,
                modelo: 'Corolla',
                placa: 'MNO-7890',
                ano: 2022,
                cor: 'Prata',
                valor: 120000,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(veiculoMontadoraInvalida);

            expect([400, 404, 422, 500]).toContain(response.status);
            expect(response.body).toBeDefined();

            // Confirma que nenhum veículo foi criado
            const listResponse = await request(app).get('/veiculos');
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const encontrado = lista.find((v) => v.placa === 'MNO-7890');
            expect(encontrado).toBeUndefined();
        });

        test('CT-021: Tentar editar um veículo inexistente', async () => {
            const dadosValidos = {
                idMontadora: montadoraId || 1,
                idCliente: clienteId || 1,
                modelo: 'Yaris',
                placa: 'XYZ-9999',
                ano: 2023,
                cor: 'Vermelho',
                valor: 95000,
            };

            const response = await request(app)
                .put('/veiculos?id=99999')
                .send(dadosValidos);

            expect([400, 404]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-022: Tentar excluir um veículo inexistente', async () => {
            const response = await request(app).delete('/veiculos/99999');

            expect([400, 404]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-023: Tentar cadastrar veículo sem campo obrigatório', async () => {
            const veiculoSemPlaca = {
                idMontadora: montadoraId || 1,
                idCliente: clienteId || 1,
                modelo: 'Corolla',
                ano: 2022,
                cor: 'Prata',
                valor: 120000,
            };

            const response = await request(app)
                .post('/veiculos')
                .send(veiculoSemPlaca);

            expect([400, 422]).toContain(response.status);
            expect(response.body).toBeDefined();
        });

        test('CT-009: Excluir um veículo existente', async () => {
            expect(veiculoId).toBeDefined();

            const response = await request(app).delete(`/veiculos/${veiculoId}`);
            expect([200, 204]).toContain(response.status);

            // Confirma que o veículo excluído não aparece mais na listagem
            const listResponse = await request(app).get('/veiculos');
            expect(listResponse.status).toBe(200);
            const lista = Array.isArray(listResponse.body) ? listResponse.body : listResponse.body.data || [];
            const removido = lista.find((v) => v.id === veiculoId);
            expect(removido).toBeUndefined();
        });
    });

    // Limpeza final dos registros base criados para os testes de relacionamento
    afterAll(async () => {
        if (clienteId) {
            await request(app).delete(`/clientes/${clienteId}`);
        }
        if (montadoraId) {
            await request(app).delete(`/montadoras/${montadoraId}`);
        }
    });
});
