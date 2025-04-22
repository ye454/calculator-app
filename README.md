# 计算器应用

基于 ConnectRPC 的前后端分离计算器应用。

## 技术栈

- **前端**: Next.js + TypeScript + ConnectRPC
- **后端**: Go + ConnectRPC

## 项目结构

```
calculator-app/
├── backend/                  # Go 后端服务
│   ├── proto/                # Protobuf 定义文件
│   │   └── calculator.proto  # 计算器服务接口定义
│   ├── service/              # gRPC 逻辑实现
│   │   └── calculator.go     # 计算器服务实现
│   ├── gen/                  # 生成的代码
│   │   └── go/               # 生成的Go代码
│   │       └── calculator/   # 计算器相关生成代码
│   │           └── v1/       # API版本
│   ├── buf.gen.yaml          # Buf生成配置
│   ├── buf.yaml              # Buf项目配置
│   └── main.go               # 服务器入口
├── frontend/                 # Next.js 前端应用
│   ├── pages/                # 页面组件
│   │   └── index.tsx         # 主页面(计算器UI)
│   ├── lib/                  # 共享库
│   │   └── connect.ts        # ConnectRPC 客户端封装
│   ├── gen/                  # 生成的代码
│   │   └── calculator/       # 计算器相关生成代码
│   │       └── v1/           # API版本
│   ├── package.json          # 依赖配置
│   ├── tsconfig.json         # TypeScript配置
│   └── next.config.js        # Next.js配置
└── README.md                 # 项目说明文档
```

## 主要功能

### 计算器功能
1. **表单式计算器** - 手动输入两个数字和选择运算符
2. **按钮式计算器** - 仿真计算器界面，支持:
   - 基本四则运算(+, -, *, /)
   - 小数点输入
   - 正负号切换
   - 百分比计算
   - 连续运算
   - 清除功能

### 后端API
提供计算服务，支持加减乘除四种基本运算。

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

### 请求参数
```
message CalculationRequest {
  double a = 1;
  double b = 2;
  string op = 3; // "+", "-", "*", "/"
}
```

### 响应数据
```
message CalculationResponse {
  double result = 1;
}
```

支持的操作符: +, -, *, / 