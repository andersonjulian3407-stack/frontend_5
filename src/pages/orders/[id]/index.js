import { useEffect, useState } from 'react';
import {
  Card, Descriptions, Table, Tag, Typography, Button,
  Spin, Alert, Space, Divider,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getOrderById } from '../../../lib/apiClient';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then(setOrder)
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} showIcon />;
  if (!order) return null;

  const itemColumns = [
    { title: 'ID Item', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Producto',
      key: 'product',
      render: (_, r) => r.product?.productName ?? '—',
    },
    {
      title: 'Presentación',
      key: 'package',
      render: (_, r) => r.product?.package ?? '—',
    },
    {
      title: 'Precio Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (v) => `$${Number(v).toFixed(2)}`,
    },
    { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, r) => (
        <Tag color="blue">${(r.unitPrice * r.quantity).toFixed(2)}</Tag>
      ),
    },
    {
      title: 'Discontinuado',
      key: 'disc',
      render: (_, r) =>
        r.product?.isDiscontinued ? (
          <Tag color="red">Sí</Tag>
        ) : (
          <Tag color="green">No</Tag>
        ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/orders')}>
          Volver
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/orders/${id}/edit`)}
        >
          Editar
        </Button>
      </Space>

      <Title level={3}>Detalle del Pedido — {order.orderNumber}</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="ID">{order.id}</Descriptions.Item>
          <Descriptions.Item label="# Pedido">{order.orderNumber}</Descriptions.Item>
          <Descriptions.Item label="Fecha">
            {dayjs(order.orderDate).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Tag color="green" style={{ fontSize: 14 }}>
              ${Number(order.totalAmount).toFixed(2)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Datos del Cliente" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID Cliente">{order.customer?.id}</Descriptions.Item>
          <Descriptions.Item label="Nombre">
            {order.customer?.firstName} {order.customer?.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Ciudad">{order.customer?.city}</Descriptions.Item>
          <Descriptions.Item label="País">{order.customer?.country}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{order.customer?.phone}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={`Items del Pedido (${order.items?.length ?? 0})`}>
        <Table
          dataSource={order.items || []}
          columns={itemColumns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 700 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={5} align="right">
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Tag color="green" style={{ fontSize: 14 }}>
                  ${Number(order.totalAmount).toFixed(2)}
                </Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </>
  );
}
