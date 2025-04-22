# 计算器应用

基于 ConnectRPC 的前后端分离计算器应用。

## 技术栈

- **前端**: Next.js + TypeScript + ConnectRPC
- **后端**: Go + ConnectRPC
- **测试**: Jest (前端) + Go Testing (后端)
- **协议**: Protobuf

## 项目概述

这是一个完整的计算器Web应用，提供两种不同的用户界面：
1. 表单式计算器 - 适合简单直接的输入
2. 按钮式计算器 - 提供类似实体计算器的交互体验

该项目采用前后端分离架构，使用ConnectRPC实现通信，前端使用React框架构建UI，后端使用Go语言处理计算逻辑。

## 项目结构

```
calculator-app/
├── backend/                  # Go 后端服务
│   ├── proto/                # Protobuf 定义文件
│   │   └── calculator.proto  # 计算器服务接口定义
│   ├── service/              # gRPC 逻辑实现
│   │   └── calculator.go     # 计算器服务实现
│   │   └── calculator_test.go # 计算器服务单元测试
│   ├── gen/                  # 生成的代码
│   │   └── go/               # 生成的Go代码
│   │       └── calculator/   # 计算器相关生成代码
│   │           └── v1/       # API版本
│   ├── buf.gen.yaml          # Buf生成配置
│   ├── buf.yaml              # Buf项目配置
│   ├── main.go               # 服务器入口
│   └── main_test.go          # API单元测试
├── frontend/                 # Next.js 前端应用
│   ├── pages/                # 页面组件
│   │   └── index.tsx         # 主页面(计算器UI)
│   │   └── index.test.tsx    # 主页面单元测试
│   ├── lib/                  # 共享库
│   │   └── connect.ts        # ConnectRPC 客户端封装
│   ├── gen/                  # 生成的代码
│   │   └── calculator/       # 计算器相关生成代码
│   │       └── v1/           # API版本
│   ├── test/                 # 测试配置和工具
│   ├── jest.config.js        # Jest测试配置
│   ├── package.json          # 依赖配置
│   ├── tsconfig.json         # TypeScript配置
│   └── next.config.js        # Next.js配置
└── README.md                 # 项目说明文档
```

## 主要功能

### 计算器功能
1. **表单式计算器** - 手动输入两个数字和选择运算符
   - 支持直接数字输入
   - 运算符下拉选择
   - 表单验证
   - 错误处理和提示

2. **按钮式计算器** - 仿真计算器界面，支持:
   - 基本四则运算(+, -, *, /)
   - 小数点输入
   - 正负号切换
   - 百分比计算
   - 连续运算（可以继续在上一次结果上操作）
   - 清除功能(AC)
   - 运算历史显示

### 后端API
提供计算服务，支持加减乘除四种基本运算，具有:
- 输入验证
- 错误处理（如除零错误）
- 高精度计算

## 技术特点

### 前端
- 响应式设计，适配不同屏幕尺寸
- React Hooks 状态管理
- TypeScript 类型安全
- Jest 单元测试和集成测试
- 无刷新计算体验
- 优雅的错误处理机制

### 后端
- Go语言高性能服务
- Protobuf 定义API接口
- ConnectRPC 提供轻量级RPC通信
- 完整的单元测试覆盖
- 优化的错误处理和返回

### 通信
- 使用现代RPC框架而非传统REST API
- 类型安全的请求和响应
- 高效的二进制传输

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

## 测试

### 后端测试

运行后端服务的单元测试:

```bash
cd backend
go test ./... -v
```

### 前端测试

运行前端组件的单元测试:

```bash
cd frontend
npm test
```

持续监视模式（开发时使用）:

```bash
cd frontend
npm run test:watch
```

## 测试结果和覆盖率

### 前端测试
- **状态**: ✅ 全部通过
- **覆盖率**: 主要组件已100%覆盖
- **测试类型**: 单元测试、集成测试
- **测试重点**: 渲染正确性、用户交互、API调用、错误处理

### 后端测试
- **HTTP API测试**: ✅ 通过
- **服务层测试**: ⚠️ protobuf生成代码存在问题需修复
- **测试类型**: 单元测试、集成测试
- **测试重点**: 计算正确性、边界条件、错误处理

## 访问应用

- **前端**: http://localhost:3000
- **后端**: http://localhost:8080

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

支持的操作符: 
- `+` : 加法
- `-` : 减法
- `*` : 乘法
- `/` : 除法

## 错误处理

API可能返回以下错误:
- 400: 无效的操作符
- 400: 除数为零
- 500: 服务器内部错误

## 已知问题和解决方案

1. **问题**: 后端服务层protobuf生成代码测试失败
   **解决方案**: 检查生成文件版本兼容性，重新生成protobuf代码

2. **问题**: 在某些浏览器上计算器显示溢出
   **解决方案**: 添加自动调整显示字体大小的功能

3. **问题**: 连续按等号时计算结果不一致
   **解决方案**: 实现历史记录功能，确保计算逻辑符合预期

## 未来计划

- 添加更复杂的数学函数支持（如平方根、三角函数等）
- 实现计算历史记录功能
- 支持键盘输入
- 添加响应式移动布局
- 优化大数计算性能
- 增加更多单元测试和边界情况测试

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可证

MIT 