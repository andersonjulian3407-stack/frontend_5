import { useState } from 'react';
import { Layout, Menu, Typography, Grid } from 'antd';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: <Link href="/">Dashboard</Link> },
  { key: '/orders', icon: <UnorderedListOutlined />, label: <Link href="/orders">Pedidos</Link> },
  { key: '/orders/new', icon: <PlusCircleOutlined />, label: <Link href="/orders/new">Nuevo Pedido</Link> },
  { key: '/products', icon: <ShopOutlined />, label: <Link href="/products">Productos</Link> },
  { key: '/health', icon: <HeartOutlined />, label: <Link href="/health">Estado del Sistema</Link> },
];

export default function AppLayout({ children }) {
  const router = useRouter();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed || isMobile}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: collapsed || isMobile ? 14 : 18,
            letterSpacing: 1,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {collapsed || isMobile ? '📦' : '📦 Orders'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={menuItems}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Typography.Title level={4} style={{ margin: 0, color: '#1677ff' }}>
            Orders Management
          </Typography.Title>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8, minHeight: 360 }}>
          {children}
        </Content>

        <Footer style={{ textAlign: 'center', color: '#999' }}>
          Orders API Frontend ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
