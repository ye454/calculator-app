package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name           string
		request        CalculationRequest
		expectedStatus int
		expectedResult float64
		expectError    bool
	}{
		{
			name: "加法测试",
			request: CalculationRequest{
				A:  10,
				B:  5,
				Op: "+",
			},
			expectedStatus: http.StatusOK,
			expectedResult: 15,
			expectError:    false,
		},
		{
			name: "减法测试",
			request: CalculationRequest{
				A:  10,
				B:  5,
				Op: "-",
			},
			expectedStatus: http.StatusOK,
			expectedResult: 5,
			expectError:    false,
		},
		{
			name: "乘法测试",
			request: CalculationRequest{
				A:  10,
				B:  5,
				Op: "*",
			},
			expectedStatus: http.StatusOK,
			expectedResult: 50,
			expectError:    false,
		},
		{
			name: "除法测试",
			request: CalculationRequest{
				A:  10,
				B:  5,
				Op: "/",
			},
			expectedStatus: http.StatusOK,
			expectedResult: 2,
			expectError:    false,
		},
		{
			name: "除以零错误测试",
			request: CalculationRequest{
				A:  10,
				B:  0,
				Op: "/",
			},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name: "未知操作符测试",
			request: CalculationRequest{
				A:  10,
				B:  5,
				Op: "invalid",
			},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 将请求体转换为JSON
			requestBody, err := json.Marshal(tt.request)
			if err != nil {
				t.Fatalf("无法序列化请求: %v", err)
			}

			// 创建请求
			req, err := http.NewRequest("POST", "/calculator/calculate", bytes.NewBuffer(requestBody))
			if err != nil {
				t.Fatalf("无法创建请求: %v", err)
			}
			req.Header.Set("Content-Type", "application/json")

			// 创建响应记录器
			rr := httptest.NewRecorder()

			// 处理请求
			handler := http.HandlerFunc(CalculateHandler)
			handler.ServeHTTP(rr, req)

			// 检查状态码
			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("处理函数返回了错误的状态码: 得到 %v 预期 %v", status, tt.expectedStatus)
			}

			// 如果预期有错误，就不检查响应体
			if tt.expectError {
				return
			}

			// 检查响应体
			var response CalculationResponse
			err = json.Unmarshal(rr.Body.Bytes(), &response)
			if err != nil {
				t.Fatalf("无法解析响应: %v", err)
			}

			if response.Result != tt.expectedResult {
				t.Errorf("处理函数返回了错误的结果: 得到 %v 预期 %v", response.Result, tt.expectedResult)
			}
		})
	}
} 