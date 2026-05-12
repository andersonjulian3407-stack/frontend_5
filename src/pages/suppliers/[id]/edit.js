import { useState, useEffect } from 'react';
import {
  Form, Input, Button, Space, Typography,
  Card, message, Divider, Row, Col, Spin, Alert,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getSupplierById, updateSupplier } from '../../../lib/localDb';

const { Title } = Typography;

export default function EditSupplier() {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const supplier = getSupplierById(id);
    if (!supplier) {
      setError('Proveedor no encontrado');
      setFetching(false);
      return;
    }
    form.setFieldsValue({
      companyName: supplier.companyName,
      contactName: supplier.contactName,
      contactTitle: supplier.contactTitle,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      phone: supplier.phone,
      fax: supplier.fax,
    });
    setFetching(false);
  }, [id, form]);

  const onFinish = (values) => {
    setLoading(true);
    try {
      const updated = updateSupplier(id, {
        companyName: values.companyName,
        contactName: values.contactName || '',
        contactTitle: values.contactTitle || '',
        address: values.address || '',
        city: values.city || '',
        country: values.country || '',
        phone: values.phone || '',
        fax: values.fax || '',
      });
      message.success(`Proveedor "${updated.companyName}" actualizado`);
      router.push('/suppliers');
    } catch (e) {
      message.error('Error al actualizar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/suppliers')}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Editar Proveedor #{id}</Title>

      <Card style={{ maxWidth: 800 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Title level={5}>Datos de la Empresa</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="companyName"
                label="Nombre de la Empresa"
                rules={[{ required: true, message: 'Ingresa el nombre de la empresa' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contactName" label="Nombre del Contacto">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contactTitle" label="Cargo del Contacto">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>Ubicación</Title>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="address" label="Dirección">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label="Ciudad">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label="País">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>Contacto</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fax" label="Fax">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Guardar Cambios
              </Button>
              <Button onClick={() => router.push('/suppliers')}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
