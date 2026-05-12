import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Spin, Alert, Tag } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { getOrders } from '../lib/apiClient';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders({ page: 1, limit: 100 })
      .then((data) => setOrders(data.rows || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} />;

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const uniqueProducts = new Set(
    orders.flatMap((o) => (o.items || []).map((i) => i.product?.id))
  ).size;
  const uniqueCustomers = new Set(orders.map((o) => o.customer?.id)).size;

  // últimos 5 pedidos para la tabla resumen
  const recent = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  const columns = [
    { title: '# Pedido', dataIndex: 'orderNumber', key: 'orderNumber' },
    {
      title: 'Cliente',
      key: 'customer',
      render: (_, r) => `${r.customer?.firstName} ${r.customer?.lastName}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (v) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => (
        <Tag color="green">${Number(v).toFixed(2)}</Tag>
      ),
    },
  ];

  return (
    <>
      <Title level={3} className="page-header">Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Pedidos"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1e40af', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Ingresos Totales"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#166534', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Productos Activos"
              value={uniqueProducts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#0f1c3f', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Clientes Únicos"
              value={uniqueCustomers}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#374151', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }} title="Últimos 5 Pedidos">
        <Table
          dataSource={recent}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </>
  );
}
