# 招聘网站项目

## 项目概述
这是一个招聘网站系统，包含前端和后端两个主要部分。后端提供API服务，前端负责用户界面和交互。

## 项目结构
```
xiangmu/
├── backend/        # 后端Java项目
│   ├── pom.xml     # Maven配置文件
│   ├── src/        # 源代码
│   └── target/     # 编译输出目录
└── frontend/       # 前端Vue项目
    ├── package.json # npm配置文件
    ├── src/        # 源代码
    └── test-storage.html # 测试文件
```

## 技术栈
### 后端
- Java
- Maven
- Spring Boot
- 数据库

### 前端
- Vue.js
- npm

## 安装说明
### 前提条件
- JDK 1.8+ 
- Maven 3.6+
- Node.js 14+
- npm 6+

### 后端安装
1. 进入backend目录
```
cd backend
```
2. 编译项目
```
mvn clean install
```

### 前端安装
1. 进入frontend目录
```
cd frontend
```
2. 安装依赖
```
npm install
```

## 运行说明
### 后端运行
```
# 在backend目录下执行
mvn spring-boot:run
```

### 前端运行
```
# 在frontend目录下执行
npm run serve
```

## 功能特点
- 用户注册和登录
- 企业用户管理
- 职位发布和管理
- 简历投递
- 消息通知

## 注意事项
1. 请确保数据库配置正确
2. 开发环境和生产环境配置可能不同
3. 更多功能细节请参考代码注释

## 作者信息
冼俊麒

## 许可证
未指定