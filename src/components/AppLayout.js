import { useState } from 'react';
import { Layout, Menu, Typography, Grid } from 'antd';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  AlertOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: '/',           icon: <DashboardOutlined />,    label: <Link href="/">Dashboard</Link> },
  { key: '/orders',     icon: <UnorderedListOutlined />, label: <Link href="/orders">Pedidos</Link> },
  { key: '/orders/new', icon: <PlusCircleOutlined />,   label: <Link href="/orders/new">Nuevo Pedido</Link> },
  { key: '/products',   icon: <ShopOutlined />,         label: <Link href="/products">Productos</Link> },
  { key: '/suppliers',  icon: <TeamOutlined />,          label: <Link href="/suppliers">Proveedores</Link> },
  { key: '/health',     icon: <AlertOutlined />,        label: <Link href="/health">Estado del Sistema</Link> },
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
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          background: '#0f1c3f',
          boxShadow: '2px 0 12px rgba(0,0,0,0.18)',
        }}
      >
        {/* Logo / Branding */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 16px',
          gap: 4,
        }}>
          <div style={{
            width: collapsed || isMobile ? 32 : 32,
            height: 32,
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShopOutlined style={{ color: '#ffffff', fontSize: 16 }} />
          </div>
          {!collapsed && !isMobile && (
            <span style={{
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}>
              Orders
            </span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={menuItems}
          style={{
            marginTop: 8,
            background: 'transparent',
            border: 'none',
          }}
        />
      </Sider>

      <Layout style={{
        marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
        transition: 'margin-left 0.2s',
        background: '#f0f2f5',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Header style={{
          background: '#ffffff',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <Typography.Title level={5} style={{
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            color: '#0f1c3f',
            letterSpacing: -0.3,
            fontWeight: 600,
          }}>
            Sistema de Gestión de Pedidos
          </Typography.Title>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#64748b',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
            }} />
            En línea
          </div>
        </Header>

        {/* Content */}
        <Content style={{
          margin: '24px 20px',
          padding: 28,
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          minHeight: 360,
        }}>
          {children}
        </Content>

        {/* Footer */}
        <Footer style={{
          textAlign: 'center',
          background: 'transparent',
          color: '#94a3b8',
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          paddingTop: 8,
        }}>
          Orders Management System © {new Date().getFullYear()} — Todos los derechos reservados
        </Footer>
      </Layout>
    </Layout>
  );
}
