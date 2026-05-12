import { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Typography, Input, Row, Col,
  Popconfirm, message, Card, Tag, Tooltip, Space,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, TeamOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getSuppliers, deleteSupplier } from '../../lib/localDb';

const { Title } = Typography;

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    const data = getSuppliers();
    setSuppliers(data);
    setFiltered(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!search) {
      setFiltered(suppliers);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        suppliers.filter(
          (s) =>
            s.companyName?.toLowerCase().includes(q) ||
            s.country?.toLowerCase().includes(q) ||
            s.city?.toLowerCase().includes(q) ||
            String(s.id).includes(q)
        )
      );
    }
  }, [search, suppliers]);

  const handleDelete = (id) => {
    deleteSupplier(id);
    message.success('Proveedor eliminado');
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
      title: 'Empresa',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName?.localeCompare(b.companyName),
    },
    {
      title: 'Contacto',
      dataIndex: 'contactName',
      key: 'contactName',
      render: (v) => v || '—',
    },
    {
      title: 'Ciudad',
      dataIndex: 'city',
      key: 'city',
      render: (v) => v || '—',
    },
    {
      title: 'País',
      dataIndex: 'country',
      key: 'country',
      render: (v) => v ? <Tag color="blue">{v}</Tag> : '—',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
      render: (v) => v || '—',
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
              onClick={() => router.push(`/suppliers/${r.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar este proveedor?"
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
            <TeamOutlined style={{ marginRight: 10, color: '#1e40af' }} />
            Gestión de Proveedores
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/suppliers/new')}
          >
            Nuevo Proveedor
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por empresa, ciudad o país"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Tag color="blue">{filtered.length} proveedor(es)</Tag>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} proveedores` }}
      />
    </>
  );
}
