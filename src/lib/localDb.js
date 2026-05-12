/**
 * localDb.js — CRUD en localStorage para Productos y Proveedores.
 * Los datos se persisten en el navegador y se pueden sembrar desde las órdenes.
 */

// ── Helpers genéricos ────────────────────────────────────────────────────────

function readStore(key) {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function writeStore(key, data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(items) {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

// ── SUPPLIERS ────────────────────────────────────────────────────────────────

const SUPPLIERS_KEY = 'db_suppliers';

export const getSuppliers = () => readStore(SUPPLIERS_KEY);

export const getSupplierById = (id) =>
  readStore(SUPPLIERS_KEY).find((s) => s.id === Number(id)) || null;

export const createSupplier = (data) => {
  const items = readStore(SUPPLIERS_KEY);
  const item = { ...data, id: nextId(items), createdAt: new Date().toISOString() };
  writeStore(SUPPLIERS_KEY, [...items, item]);
  return item;
};

export const updateSupplier = (id, data) => {
  const items = readStore(SUPPLIERS_KEY);
  const updated = items.map((s) =>
    s.id === Number(id) ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
  );
  writeStore(SUPPLIERS_KEY, updated);
  return updated.find((s) => s.id === Number(id));
};

export const deleteSupplier = (id) => {
  const items = readStore(SUPPLIERS_KEY).filter((s) => s.id !== Number(id));
  writeStore(SUPPLIERS_KEY, items);
};

// ── PRODUCTS ─────────────────────────────────────────────────────────────────

const PRODUCTS_KEY = 'db_products';

export const getProducts = () => readStore(PRODUCTS_KEY);

export const getProductById = (id) =>
  readStore(PRODUCTS_KEY).find((p) => p.id === Number(id)) || null;

export const createProduct = (data) => {
  const items = readStore(PRODUCTS_KEY);
  const item = { ...data, id: nextId(items), createdAt: new Date().toISOString() };
  writeStore(PRODUCTS_KEY, [...items, item]);
  return item;
};

export const updateProduct = (id, data) => {
  const items = readStore(PRODUCTS_KEY);
  const updated = items.map((p) =>
    p.id === Number(id) ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
  );
  writeStore(PRODUCTS_KEY, updated);
  return updated.find((p) => p.id === Number(id));
};

export const deleteProduct = (id) => {
  const items = readStore(PRODUCTS_KEY).filter((p) => p.id !== Number(id));
  writeStore(PRODUCTS_KEY, items);
};

/**
 * Siembra productos y proveedores desde las órdenes de la API si el almacén
 * local está vacío. Llama esto desde un useEffect en la página de productos.
 */
export const seedFromOrders = (orders = []) => {
  const existingProducts = readStore(PRODUCTS_KEY);
  const existingSuppliers = readStore(SUPPLIERS_KEY);

  const productMap = new Map(existingProducts.map((p) => [p.id, p]));
  const supplierMap = new Map(existingSuppliers.map((s) => [s.id, s]));

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const p = item.product;
      if (!p) return;

      // Siembra proveedor
      if (p.supplier && !supplierMap.has(p.supplier.id)) {
        supplierMap.set(p.supplier.id, {
          ...p.supplier,
          createdAt: new Date().toISOString(),
        });
      }

      // Siembra producto
      if (!productMap.has(p.id)) {
        productMap.set(p.id, {
          id: p.id,
          productName: p.productName,
          unitPrice: p.unitPrice,
          package: p.package || '',
          isDiscontinued: p.isDiscontinued || false,
          supplierId: p.supplier?.id || null,
          createdAt: new Date().toISOString(),
        });
      }
    });
  });

  writeStore(PRODUCTS_KEY, Array.from(productMap.values()));
  writeStore(SUPPLIERS_KEY, Array.from(supplierMap.values()));
};
