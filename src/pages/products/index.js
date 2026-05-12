import { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Tag, Typography, Input, Row, Col,
  Popconfirm, message, Card, Badge, Tooltip, Space, Switch,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, ReloadOutlined, ShopOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getOrders } from '../../lib/apiClient';
import {
  getProducts, deleteProduct, seedFromOrders,
  getSuppliers,
} from '../../lib/localDb';

const { Title } = Typography;

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    // Si ya hay productos locales, cargar directo; si no, sembrar desde API
    const local = getProducts();
    if (local.length > 0) {
      const sups = getSuppliers();
      setProducts(local);
      setFiltered(local);
      setSuppliers(sups);
      setLoading(false);
    } else {
      getOrders({ page: 1, limit: 200 })
        .then((data) => {
          seedFromOrders(data.rows || []);
          const seeded = getProducts();
          const sups = getSuppliers();
          setProducts(seeded);
          setFiltered(seeded);
          setSuppliers(sups);
        })
        .catch(() => {
          setProducts([]);
          setFiltered([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.productName?.toLowerCase().includes(q) ||
            String(p.id).includes(q)
        )
      );
    }
  }, [search, products]);

  const supplierName = (supplierId) => {
    const s = suppliers.find((s) => s.id === supplierId);
    return s?.companyName || '—';
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    message.success('Producto eliminado');
    load();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Producto',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName?.localeCompare(b.productName),
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (v) => `$${Number(v || 0).toFixed(2)}`,
      sorter: (a, b) => (a.unitPrice || 0) - (b.unitPrice || 0),
    },
    {
      title: 'Presentación',
      dataIndex: 'package',
      key: 'package',
      render: (v) => v || '—',
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplierId',
      key: 'supplierId',
      render: (v) => supplierName(v),
    },
    {
      title: 'Estado',
      dataIndex: 'isDiscontinued',
      key: 'isDiscontinued',
      render: (v) =>
        v ? (
          <Badge status="error" text={<Tag color="red">Discontinuado</Tag>} />
        ) : (
          <Badge status="success" text={<Tag color="green">Activo</Tag>} />
        ),
      filters: [
        { text: 'Activo', value: false },
        { text: 'Discontinuado', value: true },
      ],
      onFilter: (value, record) => record.isDiscontinued === value,
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, r) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => router.push(`/products/${r.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar este producto?"
              onConfirm={() => handleDelete(r.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" className="page-header">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <ShopOutlined style={{ marginRight: 10, color: '#1e40af' }} />
            Gestión de Productos
          </Title>
        </Col>
        <Col>
          <Space>
            <Tooltip title="Recargar datos desde API">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  localStorage.removeItem('db_products');
                  load();
                }}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/products/new')}
            >
              Nuevo Producto
            </Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por nombre o ID"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Tag color="blue">{filtered.length} producto(s)</Tag>
              <Tag color="green">
                {filtered.filter((p) => !p.isDiscontinued).length} activos
              </Tag>
              <Tag color="red">
                {filtered.filter((p) => p.isDiscontinued).length} discontinuados
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} productos` }}
        rowClassName={(r) => (r.isDiscontinued ? 'discontinued-row' : '')}
      />

      <style jsx global>{`
        .discontinued-row td {
          opacity: 0.55;
        }
      `}</style>
    </>
  );
}
