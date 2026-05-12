import { useState, useEffect } from 'react';
import {
  Form, Input, InputNumber, Button, Space, Typography,
  Card, Switch, Select, message, Divider, Spin, Alert,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getProductById, updateProduct, getSuppliers } from '../../../lib/localDb';

const { Title } = Typography;
const { Option } = Select;

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setSuppliers(getSuppliers());
  }, []);

  useEffect(() => {
    if (!id) return;
    const product = getProductById(id);
    if (!product) {
      setError('Producto no encontrado');
      setFetching(false);
      return;
    }
    form.setFieldsValue({
      productName: product.productName,
      unitPrice: product.unitPrice,
      package: product.package,
      isDiscontinued: product.isDiscontinued || false,
      supplierId: product.supplierId || undefined,
    });
    setFetching(false);
  }, [id, form]);

  const onFinish = (values) => {
    setLoading(true);
    try {
      const updated = updateProduct(id, {
        productName: values.productName,
        unitPrice: values.unitPrice,
        package: values.package || '',
        isDiscontinued: values.isDiscontinued || false,
        supplierId: values.supplierId || null,
      });
      message.success(`Producto "${updated.productName}" actualizado`);
      router.push('/products');
    } catch (e) {
      message.error('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/products')}>
          Volver
        </Button>
      </Space>

      <Title level={3}>Editar Producto #{id}</Title>

      <Card style={{ maxWidth: 720 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            />
          </Form.Item>

          <Form.Item name="package" label="Presentación / Empaque">
            <Input placeholder="Ej: Caja x 500g" />
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
                Guardar Cambios
              </Button>
              <Button onClick={() => router.push('/products')}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
