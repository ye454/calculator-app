# 计算器应用

基于 ConnectRPC 的前后端分离计算器应用。

## 技术栈

- **前端**: Next.js + TypeScript + ConnectRPC
- **后端**: Go + ConnectRPC

## 项目结构

```
calculator-app/
├── backend/                # Go 后端服务
│   ├── proto/              # Protobuf 定义文件
│   ├── service/            # gRPC 逻辑实现
│   └── main.go             # 启动入口
├── frontend/               # Next.js 前端应用
│   ├── pages/
│   │   └── index.tsx       # 主页面
│   └── lib/connect.ts      # ConnectRPC 客户端封装
```

## 开发指南

### 后端开发

1. 安装依赖

```bash
cd backend
go mod tidy
```

2. 生成 Protobuf 代码

```bash
cd backend
buf generate
```

3. 启动后端服务

```bash
cd backend
go run main.go
```

### 前端开发

1. 安装依赖

```bash
cd frontend
npm install
```

2. 启动开发服务器

```bash
cd frontend
npm run dev
```

## 访问应用

前端: http://localhost:3000
后端: http://localhost:8080

## API 接口

计算器服务提供一个简单的 RPC 接口:

```proto
service CalculatorService {
  rpc Calculate (CalculationRequest) returns (CalculationResponse);
}
```

支持的操作符: +, -, *, / 