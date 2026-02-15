import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.chatboxapp.ce', // 这里使用 package.json 中的 name，也可以改成你自己的 bundle ID
  appName: 'Chatbox',
  webDir: 'release/app/dist/renderer', // 指向构建产物目录
  server: {
    androidScheme: 'https'
  }
};

export default config;
