/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',         /* Chữ màu xanh đen đậm (dễ đọc hơn màu đen thui) */
        inkLight: '#475569',    /* Chữ phụ màu xám xanh */
        primary: '#2563eb',     /* XANH DƯƠNG CHỦ ĐẠO (Blue 600) */
        primarySoft: '#eff6ff', /* Xanh dương cực nhạt (dùng làm nền cho các tag/badge) */
        surface: '#ffffff',     /* Trắng tinh khiết cho các Card/Khối nội dung */
        mist: '#f0f9ff'         /* Nền tổng thể xanh biển siêu nhạt */
      }
    }
  },
  plugins: []
};