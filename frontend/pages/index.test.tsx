import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './index';

// 模拟fetch响应
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ result: 15 }), // 模拟一个成功的响应，结果是15
  });
});

describe('计算器组件测试', () => {
  beforeEach(() => {
    // 每次测试前重置fetch模拟
    jest.clearAllMocks();
  });

  // 测试表单式计算器
  describe('表单式计算器', () => {
    test('初始渲染时显示表单', () => {
      render(<Home />);
      
      // 检查表单元素是否存在，使用文本而不是标签关联查找元素
      expect(screen.getByText('第一个数字:')).toBeInTheDocument();
      expect(screen.getByText('第二个数字:')).toBeInTheDocument();
      expect(screen.getByText('运算符:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '计算结果' })).toBeInTheDocument();
    });

    test('提交表单后调用计算API', async () => {
      render(<Home />);
      
      // 填写表单，使用更可靠的方式选择元素
      const form = screen.getByRole('form') || document.querySelector('form');
      const inputs = form.querySelectorAll('input[type="number"]');
      const firstInput = inputs[0];
      const secondInput = inputs[1];
      const select = form.querySelector('select');
      
      fireEvent.change(firstInput, { target: { value: '10' } });
      fireEvent.change(secondInput, { target: { value: '5' } });
      fireEvent.change(select, { target: { value: '+' } });
      
      // 提交表单
      const submitButton = screen.getByRole('button', { name: '计算结果' });
      fireEvent.click(submitButton);
      
      // 验证API被调用
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/calculator/calculate',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });
  });

  // 测试按钮式计算器
  describe('按钮式计算器', () => {
    test('初始渲染时显示0', () => {
      render(<Home />);
      
      // 找到显示区域并检查它的初始值
      const displayElements = screen.getAllByText('0');
      expect(displayElements.length).toBeGreaterThan(0);
    });

    test('点击数字按钮更新显示', () => {
      render(<Home />);
      
      // 点击数字按钮
      fireEvent.click(screen.getByText('1'));
      fireEvent.click(screen.getByText('2'));
      fireEvent.click(screen.getByText('3'));
      
      // 验证显示被更新
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('点击操作符和等号执行计算', async () => {
      render(<Home />);
      
      // 输入第一个数字
      fireEvent.click(screen.getByText('5'));
      
      // 选择操作符
      fireEvent.click(screen.getByText('+'));
      
      // 输入第二个数字
      fireEvent.click(screen.getByText('3'));
      
      // 点击等号
      fireEvent.click(screen.getByText('='));
      
      // 验证API被调用
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/calculator/calculate',
          expect.objectContaining({
            method: 'POST'
          })
        );
      });
      
      // 验证结果显示
      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument();
      });
    });

    test('测试清除功能', () => {
      render(<Home />);
      
      // 输入一些数字
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('6'));
      
      // 验证显示
      expect(screen.getByText('56')).toBeInTheDocument();
      
      // 点击清除按钮
      fireEvent.click(screen.getByText('AC'));
      
      // 验证显示被重置
      const displayElements = screen.getAllByText('0');
      expect(displayElements.length).toBeGreaterThan(0);
    });
  });
}); 