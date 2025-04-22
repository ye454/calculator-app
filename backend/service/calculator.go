package service

import (
	"context"
	"fmt"
	
	calculatorv1 "calculator/gen/go/calculator/v1"
	"connectrpc.com/connect"
)

type CalculatorServer struct{}

func (s *CalculatorServer) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorv1.CalculationRequest],
) (*connect.Response[calculatorv1.CalculationResponse], error) {
	var res float64
	switch req.Msg.Op {
	case "+":
		res = req.Msg.A + req.Msg.B
	case "-":
		res = req.Msg.A - req.Msg.B
	case "*":
		res = req.Msg.A * req.Msg.B
	case "/":
		if req.Msg.B == 0 {
			return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("除数不能为0"))
		}
		res = req.Msg.A / req.Msg.B
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("未知操作符"))
	}
	return connect.NewResponse(&calculatorv1.CalculationResponse{Result: res}), nil
} 