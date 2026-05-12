import { useEffect, useState } from 'react';
import {
  Form, Input, Button, InputNumber, Space, Typography,
  Card, Divider, message, Row, Col, Spin, Alert, DatePicker,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getOrderById, updateOrder } from '../../../lib/apiClient';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function EditOrder() {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((order) => {
        form.setFieldsValue({
          orderDate: order.orderDate ? dayjs(order.orderDate) : null,
          customerId: order.customer?.id,
          items: order.items?.map((item) => ({
            id: item.id,
            productId: item.product?.id,
            productName: item.product?.productName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            package: item.product?.package,
          })) || [],
        });
      })
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setFetching(false));
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const body = {
        orderDate: values.orderDate ? values.orderDate.toISOString() : undefined,
        customer: { id: values.customerId },
        items: values.items.map((item) => ({
          id: item.id,
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
      const updated = await updateOrder(id, body);
      message.success(`Pedido actualizado — Total: $${updated.totalAmount.toFixed(2)}`);
      router.push(`/orders/${id}`);
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/orders/${id}`)}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Editar Pedido #{id}</Title>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Fecha y Cliente */}
          <Title level={5}>Datos Generales</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="orderDate" label="Fecha del Pedido">
                <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="customerId"
                label="ID del Cliente"
                rules={[{ required: true, message: 'Ingresa el ID del cliente' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Items */}
          <Title level={5}>Productos</Title>
          <Form.List name="items">
            {(fields, { add, remove }) => (
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
                        <Form.Item {...restField} name={[name, 'id']} label="ID Item">
                          <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                      </Col>
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
                      <Col xs={24} sm={12} md={7}>
                        <Form.Item
                          {...restField}
                          name={[name, 'productName']}
                          label="Nombre del Producto"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          label="Precio Unit. ($)"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label="Cantidad"
                          rules={[{ required: true, message: 'Requerido' }]}
                        >
                          <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={2}>
                        <Form.Item {...restField} name={[name, 'package']} label="Presentación">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
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
                Guardar Cambios
              </Button>
              <Button onClick={() => router.push(`/orders/${id}`)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
