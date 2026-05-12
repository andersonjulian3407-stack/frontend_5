import { useState } from 'react';
import {
  Form, Input, Button, InputNumber, Space, Typography,
  Card, Divider, message, Row, Col,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createOrder } from '../../lib/apiClient';

const { Title } = Typography;

export default function NewOrder() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const body = {
        customerId: values.customerId,
        items: values.items.map((item) => ({
          product: {
            id: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            package: item.package || '',
            isDiscontinued: false,
          },
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      };
      const created = await createOrder(body);
      message.success(`Pedido ${created.orderNumber} creado — Total: $${created.totalAmount.toFixed(2)}`);
      router.push('/orders');
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/orders')}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Crear Nuevo Pedido</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ items: [{}] }}
        >
          {/* Cliente */}
          <Title level={5}>Datos del Cliente</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="customerId"
                label="ID del Cliente"
                rules={[{ required: true, message: 'Ingresa el ID del cliente' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="Ej: 1" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Items */}
          <Title level={5}>Productos</Title>
          <Form.List name="items" rules={[
            {
              validator: async (_, items) => {
                if (!items || items.length === 0)
                  return Promise.reject(new Error('Agrega al menos un producto'));
              },
            },
          ]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}
                    extra={
                      fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ color: '#dc2626', cursor: 'pointer' }}
                          onClick={() => remove(name)}
                        />
                      )
                    }
                    title={`Producto ${name + 1}`}
                  >
                    <Row gutter={12}>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productId']}
                          label="ID Producto"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productName']}
                          label="Nombre del Producto"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <Input placeholder="Ej: Café Colombiano Premium" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          label="Precio Unitario ($)"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label="Cantidad"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'package']}
                          label="Presentación"
                        >
                          <Input placeholder="Ej: Caja x 500g" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.ErrorList errors={errors} />
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  Agregar Producto
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Crear Pedido
              </Button>
              <Button onClick={() => form.resetFields()}>Limpiar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
