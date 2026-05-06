import { ConfigProvider, App as AntApp } from 'antd';
import esES from 'antd/locale/es_ES';
import AppLayout from '../components/AppLayout';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider locale={esES} theme={{ token: { colorPrimary: '#1677ff' } }}>
      <AntApp>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AntApp>
    </ConfigProvider>
  );
}
