// 添加测试环境的全局设置
require('@testing-library/jest-dom');

// 模拟fetch API
global.fetch = jest.fn(); 