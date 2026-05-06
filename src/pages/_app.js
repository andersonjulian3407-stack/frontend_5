import { ConfigProvider, App as AntApp } from 'antd';
import esES from 'antd/locale/es_ES';
import AppLayout from '../components/AppLayout';
import '../styles/globals.css';

const pastelTheme = {
  token: {
    colorPrimary: '#f5b0c8',
    colorPrimaryHover: '#f0a0bc',
    colorPrimaryActive: '#e890b0',
    colorLink: '#c4748a',
    colorLinkHover: '#b05878',
    colorBorder: '#f9c8d9',
    colorBorderSecondary: '#fde8f0',
    colorBgContainer: '#fffcfe',
    colorBgLayout: '#fff5f8',
    colorText: '#6b4050',
    colorTextSecondary: '#c4748a',
    colorTextPlaceholder: '#d4a0b0',
    colorSuccess: '#8ecfa0',
    colorError: '#e8a0a8',
    colorWarning: '#f5c8a0',
    borderRadius: 12,
    borderRadiusLG: 18,
    borderRadiusSM: 8,
    fontFamily: "'Lato', -apple-system, sans-serif",
    fontSize: 14,
    boxShadow: '0 4px 18px rgba(220, 150, 170, 0.1)',
  },
  components: {
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(255,255,255,0.5)',
      darkItemHoverBg: 'rgba(255,255,255,0.35)',
      darkItemColor: '#a05070',
      darkItemSelectedColor: '#b05878',
    },
    Button: {
      borderRadius: 22,
      borderRadiusLG: 26,
      borderRadiusSM: 18,
      primaryColor: '#ffffff',
    },
    Table: {
      headerBg: '#fff0f5',
      headerColor: '#c4748a',
      rowHoverBg: '#fff8fb',
      borderColor: '#fde8f0',
    },
    Card: {
      borderRadius: 18,
    },
    Input: {
      borderRadius: 12,
      activeBorderColor: '#f5b0c8',
      hoverBorderColor: '#f9c8d9',
    },
    Tag: {
      borderRadius: 22,
    },
    Statistic: {
      contentFontSize: 28,
    },
  },
};

export default function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider locale={esES} theme={pastelTheme}>
      <AntApp>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AntApp>
    </ConfigProvider>
  );
}
