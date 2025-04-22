package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	
	"github.com/rs/cors"
)

// CalculationRequest 表示计算请求
type CalculationRequest struct {
	A  float64 `json:"a"`
	B  float64 `json:"b"`
	Op string  `json:"op"`
}

// CalculationResponse 表示计算响应
type CalculationResponse struct {
	Result float64 `json:"result"`
}

// CalculateHandler 处理计算请求
func CalculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "只支持POST请求", http.StatusMethodNotAllowed)
		return
	}

	var req CalculationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "无效的请求格式", http.StatusBadRequest)
		return
	}

	var result float64
	switch req.Op {
	case "+":
		result = req.A + req.B
	case "-":
		result = req.A - req.B
	case "*":
		result = req.A * req.B
	case "/":
		if req.B == 0 {
			http.Error(w, "除数不能为0", http.StatusBadRequest)
			return
		}
		result = req.A / req.B
	default:
		http.Error(w, fmt.Sprintf("不支持的操作符: %s", req.Op), http.StatusBadRequest)
		return
	}

	response := CalculationResponse{Result: result}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/calculator/calculate", CalculateHandler)

	// 静态测试页面
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>计算器测试</title>
			<style>
				body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
				.form-group { margin-bottom: 10px; }
				button { padding: 5px 10px; background: #4CAF50; color: white; border: none; cursor: pointer; }
				#result { margin-top: 20px; font-weight: bold; }
			</style>
		</head>
		<body>
			<h1>计算器API测试</h1>
			<div class="form-group">
				<label>A:</label>
				<input type="number" id="valueA" value="10">
			</div>
			<div class="form-group">
				<label>操作符:</label>
				<select id="operator">
					<option value="+">+</option>
					<option value="-">-</option>
					<option value="*">*</option>
					<option value="/">/</option>
				</select>
			</div>
			<div class="form-group">
				<label>B:</label>
				<input type="number" id="valueB" value="5">
			</div>
			<button id="calculate">计算</button>
			<div id="result"></div>

			<script>
				document.getElementById('calculate').addEventListener('click', async () => {
					const a = parseFloat(document.getElementById('valueA').value);
					const b = parseFloat(document.getElementById('valueB').value);
					const op = document.getElementById('operator').value;

					try {
						const response = await fetch('/calculator/calculate', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ a, b, op }),
						});

						if (!response.ok) {
							throw new Error('计算失败: ' + await response.text());
						}

						const data = await response.json();
						document.getElementById('result').textContent = '结果: ' + data.result;
					} catch (error) {
						document.getElementById('result').textContent = '错误: ' + error.message;
					}
				});
			</script>
		</body>
		</html>
		`))
	})

	// 添加CORS支持
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	log.Println("服务启动在 localhost:8080")
	http.ListenAndServe(":8080", corsHandler.Handler(mux))
} 