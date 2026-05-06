import { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Input, DatePicker, Space, Typography, Tag,
  Popconfirm, message, Row, Col, Tooltip,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getOrders, deleteOrder } from '../../lib/apiClient';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function OrdersList() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10, customerId: '', dateFrom: '', dateTo: '' });

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    getOrders(params)
      .then((data) => {
        setOrders(data.rows || []);
        setTotal(data.count || 0);
      })
      .catch((e) => message.error(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success('Pedido eliminado');
      fetchOrders();
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '# Pedido', dataIndex: 'orderNumber', key: 'orderNumber' },
    {
      title: 'Cliente',
      key: 'customer',
      render: (_, r) => `${r.customer?.firstName ?? ''} ${r.customer?.lastName ?? ''}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (v) => dayjs(v).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => <Tag color="green">${Number(v).toFixed(2)}</Tag>,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, r) => <Tag>{r.items?.length ?? 0} item(s)</Tag>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, r) => (
        <Space>
          <Tooltip title="Ver detalle">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/orders/${r.id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => router.push(`/orders/${r.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar este pedido?"
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
          <Title level={3} style={{ margin: 0 }}>Listado de Pedidos</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/orders/new')}
          >
            Nuevo Pedido
          </Button>
        </Col>
      </Row>

      {/* Filtros */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Filtrar por ID cliente"
            prefix={<SearchOutlined />}
            value={filters.customerId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, customerId: e.target.value, page: 1 }))
            }
            allowClear
          />
        </Col>
        <Col xs={24} sm={16} md={10}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={(_, [from, to]) =>
              setFilters((f) => ({ ...f, dateFrom: from || '', dateTo: to || '', page: 1 }))
            }
          />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Button onClick={fetchOrders} block>Buscar</Button>
        </Col>
      </Row>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (t) => `${t} pedidos`,
          onChange: (page, limit) => setFilters((f) => ({ ...f, page, limit })),
        }}
      />
    </>
  );
}
