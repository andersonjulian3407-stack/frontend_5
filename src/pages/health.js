import { useEffect, useState } from 'react';
import {
  Card, Typography, Tag, Button, Space, Descriptions,
  Alert, Spin, Row, Col, Divider, Table,
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined,
  ReloadOutlined, LinkOutlined,
} from '@ant-design/icons';
import { getHealth } from '../lib/apiClient';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const DOCS_URL = `${API_BASE}/docs`;

export default function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = () => {
    setLoading(true);
    setError(null);
    getHealth()
      .then((data) => {
        setHealth(data);
        setLastChecked(new Date());
      })
      .catch((e) => {
        setError(e.message);
        setHealth(null);
        setLastChecked(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { checkHealth(); }, []);

  const isOk = health?.status === 'ok';

  const testCases = [
    { key: 1, caso: 'Crear pedido válido', esperado: '201 + total calculado', endpoint: 'POST /api/v1/orders' },
    { key: 2, caso: 'Consultar pedido inexistente (id: 9999)', esperado: '404 Not Found', endpoint: 'GET /api/v1/orders/9999' },
    { key: 3, caso: 'Agregar item a pedido', esperado: '201 + total recalculado', endpoint: 'POST /api/v1/orders' },
    { key: 4, caso: 'Actualizar cantidad', esperado: '200 + total recalculado', endpoint: 'PATCH /api/v1/orders/:id' },
    { key: 5, caso: 'Eliminar pedido', esperado: '204 No Content', endpoint: 'DELETE /api/v1/orders/:id' },
    { key: 6, caso: 'Listar con paginación ?page=1&limit=10', esperado: '200 con metadata', endpoint: 'GET /api/v1/orders?page=1&limit=10' },
    { key: 7, caso: 'GET /api/v1/health', esperado: '200 OK', endpoint: 'GET /api/v1/health' },
    { key: 8, caso: 'GET /api/v1/docs', esperado: 'Documentación disponible', endpoint: 'GET /api/v1/docs' },
  ];

  const testColumns = [
    { title: 'Caso', dataIndex: 'caso', key: 'caso' },
    {
      title: 'Resultado Esperado',
      dataIndex: 'esperado',
      key: 'esperado',
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (v) => <Text code>{v}</Text>,
    },
  ];

  return (
    <>
      <Title level={3} className="page-header">Estado del Sistema</Title>

      <Row gutter={[16, 16]}>
        {/* Estado de la API */}
        <Col xs={24} md={12}>
          <Card
            title="API REST"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={checkHealth}
                loading={loading}
                size="small"
              >
                Verificar
              </Button>
            }
          >
            {loading && <Spin />}
            {!loading && error && (
              <Alert
                type="error"
                icon={<CloseCircleOutlined />}
                message="API no disponible"
                description={error}
                showIcon
              />
            )}
            {!loading && health && (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag
                  color={isOk ? 'success' : 'error'}
                  icon={isOk ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  style={{ fontSize: 16, padding: '4px 12px' }}
                >
                  {isOk ? 'ONLINE — OK' : 'ERROR'}
                </Tag>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Status">{health.status}</Descriptions.Item>
                  <Descriptions.Item label="Timestamp del servidor">
                    {dayjs(health.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                  </Descriptions.Item>
                  {lastChecked && (
                    <Descriptions.Item label="Última verificación">
                      {dayjs(lastChecked).format('DD/MM/YYYY HH:mm:ss')}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Space>
            )}
          </Card>
        </Col>

        {/* Documentación */}
        <Col xs={24} md={12}>
          <Card title="Documentación API">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                La documentación interactiva (Swagger UI) está disponible en el endpoint{' '}
                <Text code>/api/v1/docs</Text>.
              </Text>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir Documentación
              </Button>
              <Divider />
              <Title level={5}>Endpoints disponibles</Title>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="GET /api/v1/health">Health check</Descriptions.Item>
                <Descriptions.Item label="GET /api/v1/docs">Swagger UI</Descriptions.Item>
                <Descriptions.Item label="GET /api/v1/orders">Listar pedidos (paginado)</Descriptions.Item>
                <Descriptions.Item label="GET /api/v1/orders/:id">Obtener pedido</Descriptions.Item>
                <Descriptions.Item label="POST /api/v1/orders">Crear pedido</Descriptions.Item>
                <Descriptions.Item label="PATCH /api/v1/orders/:id">Actualizar pedido</Descriptions.Item>
                <Descriptions.Item label="PUT /api/v1/orders/:id">Reemplazar pedido</Descriptions.Item>
                <Descriptions.Item label="DELETE /api/v1/orders/:id">Eliminar pedido</Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Casos de prueba */}
      <Card title="Casos de Prueba Mínimos" style={{ marginTop: 24 }}>
        <Table
          dataSource={testCases}
          columns={testColumns}
          pagination={false}
          size="small"
          scroll={{ x: 600 }}
        />
      </Card>
    </>
  );
}
