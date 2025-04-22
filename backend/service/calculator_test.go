package service

import (
	"context"
	"testing"
	
	calculatorv1 "calculator/gen/go/calculator/v1"
	"connectrpc.com/connect"
)

func TestCalculatorServer_Calculate(t *testing.T) {
	server := &CalculatorServer{}
	ctx := context.Background()
	
	tests := []struct {
		name    string
		request *connect.Request[calculatorv1.CalculationRequest]
		want    float64
		wantErr bool
	}{
		{
			name: "加法测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  5,
				Op: "+",
			}),
			want:    15,
			wantErr: false,
		},
		{
			name: "减法测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  5,
				Op: "-",
			}),
			want:    5,
			wantErr: false,
		},
		{
			name: "乘法测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  5,
				Op: "*",
			}),
			want:    50,
			wantErr: false,
		},
		{
			name: "除法测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  5,
				Op: "/",
			}),
			want:    2,
			wantErr: false,
		},
		{
			name: "除以零错误测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  0,
				Op: "/",
			}),
			want:    0,
			wantErr: true,
		},
		{
			name: "未知操作符测试",
			request: connect.NewRequest(&calculatorv1.CalculationRequest{
				A:  10,
				B:  5,
				Op: "invalid",
			}),
			want:    0,
			wantErr: true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := server.Calculate(ctx, tt.request)
			
			// 检查错误情况
			if (err != nil) != tt.wantErr {
				t.Errorf("CalculatorServer.Calculate() 错误 = %v, 预期错误 = %v", err != nil, tt.wantErr)
				return
			}
			
			// 如果预期有错误，就不检查结果
			if tt.wantErr {
				return
			}
			
			// 检查计算结果
			if got.Msg.Result != tt.want {
				t.Errorf("CalculatorServer.Calculate() = %v, 预期 = %v", got.Msg.Result, tt.want)
			}
		})
	}
} 