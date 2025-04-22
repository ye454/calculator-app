import { createConnectTransport } from '@connectrpc/connect-web';
import { CalculatorService, createServiceClient } from '../gen/calculator/v1/calculator_connect';

// 创建传输层
const transport = createConnectTransport({
  baseUrl: 'http://localhost:8080',
});

// 创建客户端
export const client = createServiceClient(transport); 