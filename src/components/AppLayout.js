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
  { key: '/',           icon: <DashboardOutlined />,    label: <Link href="/">Dashboard</Link> },
  { key: '/orders',     icon: <UnorderedListOutlined />, label: <Link href="/orders">Pedidos</Link> },
  { key: '/orders/new', icon: <PlusCircleOutlined />,   label: <Link href="/orders/new">Nuevo Pedido</Link> },
  { key: '/products',   icon: <ShopOutlined />,         label: <Link href="/products">Productos</Link> },
  { key: '/health',     icon: <HeartOutlined />,        label: <Link href="/health">Estado del Sistema</Link> },
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
          background: 'linear-gradient(180deg, #fde8f0 0%, #f9c8d9 55%, #f5b0c8 100%)',
          boxShadow: '3px 0 18px rgba(220,150,170,0.15)',
        }}
      >
        {/* Logo */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          padding: '8px 0',
        }}>
          <span style={{ fontSize: collapsed || isMobile ? 22 : 24 }}>🌸</span>
          {!collapsed && !isMobile && (
            <span style={{
              color: '#a05070',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              marginTop: 2,
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

        {!collapsed && !isMobile && (
          <div style={{
            position: 'absolute',
            bottom: 64,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 16,
            letterSpacing: 6,
            opacity: 0.5,
          }}>
            🎀
          </div>
        )}
      </Sider>

      <Layout style={{
        marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
        transition: 'margin-left 0.2s',
        background: 'linear-gradient(160deg, #fff5f8 0%, #ffeef4 40%, #fde8f0 100%)',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Header style={{
          background: 'linear-gradient(90deg, #fff8fb, #fde8f0)',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(220,150,170,0.1)',
          borderBottom: '1.5px solid #f9c8d9',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <Typography.Title level={4} style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            color: '#c4748a',
            letterSpacing: 0.5,
            fontWeight: 600,
          }}>
            🎀 Orders Management
          </Typography.Title>
          <span style={{ fontSize: 18, opacity: 0.6 }}>🌷</span>
        </Header>

        {/* Content */}
        <Content style={{
          margin: '24px 20px',
          padding: 28,
          background: 'rgba(255, 252, 254, 0.92)',
          borderRadius: 22,
          boxShadow: '0 6px 28px rgba(220,150,170,0.09)',
          border: '1px solid #fde8f0',
          minHeight: 360,
        }}>
          {children}
        </Content>

        {/* Footer */}
        <Footer style={{
          textAlign: 'center',
          background: 'transparent',
          color: '#d4a0b0',
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 13,
          paddingTop: 8,
        }}>
          🌸 Orders Management ©{new Date().getFullYear()} 🌸
        </Footer>
      </Layout>
    </Layout>
  );
}
