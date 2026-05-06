/**
 * Gestión de Productos
 *
 * La API actual no tiene endpoints dedicados para productos, pero los productos
 * viven dentro de los pedidos. Esta pantalla extrae todos los productos únicos
 * de los pedidos existentes y permite ver su estado (discontinuado o no).
 *
 * Para un CRUD completo de productos se necesitaría extender la API con
 * endpoints /api/v1/products — esta pantalla está preparada para eso.
 */
import { useEffect, useState } from 'react';
import {
  Table, Tag, Typography, Spin, Alert, Input, Row, Col,
  Button, Tooltip, Badge, Card,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getOrders } from '../../lib/apiClient';

const { Title } = Typography;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    getOrders({ page: 1, limit: 100 })
      .then((data) => {
        // Extraer productos únicos de todos los pedidos
        const map = new Map();
        (data.rows || []).forEach((order) => {
          (order.items || []).forEach((item) => {
            const p = item.product;
            if (p && !map.has(p.id)) {
              map.set(p.id, {
                ...p,
                supplier: p.supplier,
                ordersCount: 1,
              });
            } else if (p && map.has(p.id)) {
              map.get(p.id).ordersCount += 1;
            }
          });
        });
        const list = Array.from(map.values());
        setProducts(list);
        setFiltered(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.productName?.toLowerCase().includes(q) ||
            p.supplier?.companyName?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, products]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, sorter: (a, b) => a.id - b.id },
    {
      title: 'Producto',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (v) => `$${Number(v).toFixed(2)}`,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    { title: 'Presentación', dataIndex: 'package', key: 'package' },
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
      title: 'Proveedor',
      key: 'supplier',
      render: (_, r) => r.supplier?.companyName ?? '—',
    },
    {
      title: 'País Proveedor',
      key: 'country',
      render: (_, r) => r.supplier?.country ?? '—',
    },
    {
      title: 'Aparece en Pedidos',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
      render: (v) => <Tag color="blue">{v}</Tag>,
      sorter: (a, b) => a.ordersCount - b.ordersCount,
    },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <>
      <Row justify="space-between" align="middle" className="page-header">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Gestión de Productos</Title>
        </Col>
        <Col>
          <Tooltip title="Recargar">
            <Button icon={<ReloadOutlined />} onClick={fetchProducts} />
          </Tooltip>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por nombre o proveedor"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Tag color="blue">{filtered.length} producto(s)</Tag>
            <Tag color="green">
              {filtered.filter((p) => !p.isDiscontinued).length} activos
            </Tag>
            <Tag color="red">
              {filtered.filter((p) => p.isDiscontinued).length} discontinuados
            </Tag>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        scroll={{ x: 900 }}
        rowClassName={(r) => (r.isDiscontinued ? 'ant-table-row-disabled' : '')}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} productos` }}
      />
    </>
  );
}
