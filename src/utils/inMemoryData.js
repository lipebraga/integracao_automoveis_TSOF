const stores = {};

export function getStore(storeName) {
    if (!stores[storeName]) {
        stores[storeName] = [];
    }
    return stores[storeName];
}

export function listRecords(storeName) {
    return [...getStore(storeName)];
}

export function findRecord(storeName, id) {
    const numericId = Number(id);
    return getStore(storeName).find((item) => Number(item.id) === numericId) ?? null;
}

export function createRecord(storeName, data) {
    const list = getStore(storeName);
    const nextId = list.length > 0 ? Math.max(...list.map((item) => Number(item.id || 0))) + 1 : 1;
    const record = { ...data, id: nextId };
    list.push(record);
    return { ...record, insertId: nextId, affectedRows: 1 };
}

export function updateRecord(storeName, id, data) {
    const list = getStore(storeName);
    const index = list.findIndex((item) => Number(item.id) === Number(id));

    if (index === -1) {
        return null;
    }

    const updated = { ...list[index], ...data, id: Number(id) };
    list[index] = updated;
    return { ...updated, affectedRows: 1 };
}

export function deleteRecord(storeName, id) {
    const list = getStore(storeName);
    const index = list.findIndex((item) => Number(item.id) === Number(id));

    if (index === -1) {
        return { affectedRows: 0 };
    }

    list.splice(index, 1);
    return { affectedRows: 1 };
}
