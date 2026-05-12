import { useState, useEffect } from 'react';
import {
  Form, Input, InputNumber, Button, Space, Typography,
  Card, Switch, Select, message, Divider,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createProduct, getSuppliers } from '../../lib/localDb';

const { Title } = Typography;
const { Option } = Select;

export default function NewProduct() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setSuppliers(getSuppliers());
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    try {
      const product = createProduct({
        productName: values.productName,
        unitPrice: values.unitPrice,
        package: values.package || '',
        isDiscontinued: values.isDiscontinued || false,
        supplierId: values.supplierId || null,
      });
      message.success(`Producto "${product.productName}" creado correctamente`);
      router.push('/products');
    } catch (e) {
      message.error('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/products')}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Nuevo Producto</Title>

      <Card style={{ maxWidth: 720 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isDiscontinued: false }}
        >
          <Form.Item
            name="productName"
            label="Nombre del Producto"
            rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
          >
            <Input placeholder="Ej: Café Colombiano Premium" />
          </Form.Item>

          <Form.Item
            name="unitPrice"
            label="Precio Unitario ($)"
            rules={[{ required: true, message: 'Ingresa el precio' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item name="package" label="Presentación / Empaque">
            <Input placeholder="Ej: Caja x 500g, Bolsa x 1kg" />
          </Form.Item>

          <Form.Item name="supplierId" label="Proveedor">
            <Select placeholder="Seleccionar proveedor (opcional)" allowClear>
              {suppliers.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.companyName} {s.country ? `— ${s.country}` : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="isDiscontinued"
            label="¿Producto Discontinuado?"
            valuePropName="checked"
          >
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Guardar Producto
              </Button>
              <Button onClick={() => form.resetFields()}>Limpiar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
