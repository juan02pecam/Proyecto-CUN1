const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
const isLan = /^https?:\/\/(?!localhost(?:$|:)|127\.0\.0\.1)/.test(url);
console.log(`API URL: ${url}`);
console.log(isLan ? 'Device-friendly URL detected.' : 'Local development URL detected. Use a LAN IP on a physical device.');
