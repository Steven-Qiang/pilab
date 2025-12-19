import { onMounted, ref } from 'vue';

interface DeviceInfo {
  browser: string;
  cores: number;
  architecture: string;
  platform: string;
}

export function useDeviceInfo() {
  const deviceInfo = ref<DeviceInfo>({
    browser: '',
    cores: 0,
    architecture: '',
    platform: '',
  });

  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome'))
      deviceInfo.value.browser = 'Chrome';
    else if (ua.includes('Firefox'))
      deviceInfo.value.browser = 'Firefox';
    else if (ua.includes('Safari'))
      deviceInfo.value.browser = 'Safari';
    else if (ua.includes('Edge'))
      deviceInfo.value.browser = 'Edge';
    else deviceInfo.value.browser = 'Unknown';

    deviceInfo.value.cores = navigator.hardwareConcurrency || 0;

    // 检测架构
    if (ua.includes('ARM') || ua.includes('aarch64'))
      deviceInfo.value.architecture = 'ARM';
    else if (ua.includes('x86_64') || ua.includes('Win64') || ua.includes('x64'))
      deviceInfo.value.architecture = 'x86_64';
    else if (ua.includes('x86') || ua.includes('i686'))
      deviceInfo.value.architecture = 'x86';
    else
      deviceInfo.value.architecture = 'Unknown';

    deviceInfo.value.platform = navigator.platform || 'Unknown';
  };

  onMounted(() => {
    detectDevice();
  });

  return {
    deviceInfo,
  };
}
