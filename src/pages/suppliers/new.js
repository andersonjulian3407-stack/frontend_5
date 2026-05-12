import { useState } from 'react';
import {
  Form, Input, Button, Space, Typography,
  Card, message, Divider, Row, Col,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createSupplier } from '../../lib/localDb';

const { Title } = Typography;

export default function NewSupplier() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    try {
      const supplier = createSupplier({
        companyName: values.companyName,
        contactName: values.contactName || '',
        contactTitle: values.contactTitle || '',
        address: values.address || '',
        city: values.city || '',
        country: values.country || '',
        phone: values.phone || '',
        fax: values.fax || '',
      });
      message.success(`Proveedor "${supplier.companyName}" creado correctamente`);
      router.push('/suppliers');
    } catch (e) {
      message.error('Error al crear el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/suppliers')}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Nuevo Proveedor</Title>

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
                <Input placeholder="Ej: Distribuidora Andina S.A." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contactName" label="Nombre del Contacto">
                <Input placeholder="Ej: Juan Pérez" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contactTitle" label="Cargo del Contacto">
                <Input placeholder="Ej: Gerente Comercial" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>Ubicación</Title>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="address" label="Dirección">
                <Input placeholder="Ej: Calle 123 # 45-67" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label="Ciudad">
                <Input placeholder="Ej: Bogotá" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label="País">
                <Input placeholder="Ej: Colombia" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>Contacto</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Teléfono">
                <Input placeholder="Ej: +57 1 234 5678" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fax" label="Fax">
                <Input placeholder="Ej: +57 1 234 5679" />
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
                Guardar Proveedor
              </Button>
              <Button onClick={() => form.resetFields()}>Limpiar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
