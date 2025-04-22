import { useState } from 'react';

export default function Home() {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previousDisplay, setPreviousDisplay] = useState<string>('');
  
  // 表单区域的状态
  const [formValueA, setFormValueA] = useState<string>('0');
  const [formValueB, setFormValueB] = useState<string>('0');
  const [formOperator, setFormOperator] = useState<string>('+');
  const [formResult, setFormResult] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showFormResult, setShowFormResult] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setError(null);
    setPreviousDisplay('');
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator && !waitingForSecondOperand) {
      performCalculation(operator, inputValue);
    }

    setPreviousDisplay(`${waitingForSecondOperand ? firstOperand : inputValue} ${nextOperator}`);
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) return;

    try {
      setError(null);
      const response = await fetch('http://localhost:8080/calculator/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a: firstOperand, b: secondOperand, op }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '计算请求失败');
      }

      const data = await response.json();
      setDisplay(String(data.result));
      setFirstOperand(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算出错');
      setDisplay('0');
      setFirstOperand(null);
      setPreviousDisplay('');
    }
  };

  // 表单计算处理函数
  const handleFormCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const a = parseFloat(formValueA);
    const b = parseFloat(formValueB);
    
    if (isNaN(a) || isNaN(b)) {
      setFormError('请输入有效的数字');
      return;
    }
    
    try {
      setFormError(null);
      const response = await fetch('http://localhost:8080/calculator/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b, op: formOperator }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '计算请求失败');
      }

      const data = await response.json();
      setFormResult(String(data.result));
      setShowFormResult(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '计算出错');
      setFormResult(null);
    }
  };

  const handleEquals = () => {
    if (operator === null || firstOperand === null || waitingForSecondOperand) {
      return;
    }
    
    const inputValue = parseFloat(display);
    // 显示完整的计算表达式
    setPreviousDisplay(`${firstOperand} ${operator} ${inputValue} =`);
    performCalculation(operator, inputValue);
    setOperator(null);
  };

  const handlePercentage = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  // 渲染数字按钮
  const renderDigitButtons = () => {
    const digits = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
    return digits.map((digit) => (
      <button
        key={digit}
        onClick={() => inputDigit(digit.toString())}
        style={buttonStyle}
        className={digit === 0 ? "zero" : ""}
      >
        {digit}
      </button>
    ));
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    maxWidth: '320px',
    margin: '20px auto',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  };

  const displayContainerStyle = {
    backgroundColor: '#263238',
    color: 'white',
    padding: '10px 20px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end'
  };

  const previousDisplayStyle = {
    textAlign: 'right' as const,
    fontSize: '1rem',
    color: '#B0BEC5',
    minHeight: '20px',
    marginBottom: '5px',
    fontWeight: 'normal',
  };

  const displayStyle = {
    textAlign: 'right' as const,
    fontSize: '2.5rem',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  };

  const calculatorPadStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    backgroundColor: '#ccc',
  };

  const buttonStyle = {
    border: 'none',
    backgroundColor: 'white',
    fontSize: '1.5rem',
    padding: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&:active': {
      backgroundColor: '#e0e0e0',
    }
  };

  const operatorButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5923e',
    color: 'white',
    fontWeight: 'bold' as const,
    '&:hover': {
      backgroundColor: '#f47c20',
    },
    '&:active': {
      backgroundColor: '#e76b0e',
    }
  };

  const functionButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
    '&:active': {
      backgroundColor: '#c0c0c0',
    }
  };

  const zeroButtonStyle = {
    ...buttonStyle,
    gridColumn: 'span 2',
  };

  const equalButtonStyle = {
    ...operatorButtonStyle,
    backgroundColor: '#4CAF50',
    '&:hover': {
      backgroundColor: '#3d9c40',
    },
    '&:active': {
      backgroundColor: '#357935',
    }
  };

  const errorDisplayStyle = {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    textAlign: 'center' as const,
    margin: '8px',
    fontSize: '16px',
    display: error !== null ? 'block' : 'none',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    backgroundColor: '#4CAF50',
    color: 'white',
    margin: 0,
    padding: '10px',
    fontSize: '1.5rem',
  };

  // 表单区域样式
  const formContainerStyle = {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const formLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  };

  const formInputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' as const,
  };

  const formSelectStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
  };

  const formButtonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const formResultStyle = {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    marginTop: '15px',
    display: showFormResult ? 'block' : 'none',
  };

  const formErrorStyle = {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    textAlign: 'center' as const,
    marginTop: '15px',
    fontSize: '14px',
    display: formError !== null ? 'block' : 'none',
  };

  const sectionTitleStyle = {
    textAlign: 'center' as const,
    margin: '30px 0 15px',
    color: '#333',
    fontSize: '1.5rem',
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>表单式计算器</h2>
      <div style={formContainerStyle}>
        <form onSubmit={handleFormCalculate}>
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>第一个数字:</label>
            <input 
              type="number" 
              value={formValueA} 
              onChange={(e) => setFormValueA(e.target.value)}
              style={formInputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>运算符:</label>
            <select 
              value={formOperator} 
              onChange={(e) => setFormOperator(e.target.value)}
              style={formSelectStyle}
            >
              <option value="+">加法 (+)</option>
              <option value="-">减法 (-)</option>
              <option value="*">乘法 (×)</option>
              <option value="/">除法 (÷)</option>
            </select>
          </div>
          
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>第二个数字:</label>
            <input 
              type="number" 
              value={formValueB} 
              onChange={(e) => setFormValueB(e.target.value)}
              style={formInputStyle}
              required
            />
          </div>
          
          <button type="submit" style={formButtonStyle}>
            计算结果
          </button>
        </form>
        
        <div style={formResultStyle}>
          计算结果: {formResult}
        </div>
        
        <div style={formErrorStyle}>
          错误: {formError}
        </div>
      </div>

      <h2 style={sectionTitleStyle}>按钮式计算器</h2>
      <div style={containerStyle}>
        <h1 style={headerStyle}>计算器</h1>
        
        <div style={displayContainerStyle}>
          <div style={previousDisplayStyle}>
            {previousDisplay}
          </div>
          <div style={displayStyle}>
            {display}
          </div>
        </div>
        
        <div style={errorDisplayStyle}>
          错误: {error}
        </div>
        
        <div style={calculatorPadStyle}>
          {/* 功能按钮 */}
          <button onClick={clearDisplay} style={functionButtonStyle}>AC</button>
          <button onClick={toggleSign} style={functionButtonStyle}>+/-</button>
          <button onClick={handlePercentage} style={functionButtonStyle}>%</button>
          <button onClick={() => handleOperator('/')} style={operatorButtonStyle}>÷</button>
          
          {/* 第一行数字 */}
          <button onClick={() => inputDigit('7')} style={buttonStyle}>7</button>
          <button onClick={() => inputDigit('8')} style={buttonStyle}>8</button>
          <button onClick={() => inputDigit('9')} style={buttonStyle}>9</button>
          <button onClick={() => handleOperator('*')} style={operatorButtonStyle}>×</button>
          
          {/* 第二行数字 */}
          <button onClick={() => inputDigit('4')} style={buttonStyle}>4</button>
          <button onClick={() => inputDigit('5')} style={buttonStyle}>5</button>
          <button onClick={() => inputDigit('6')} style={buttonStyle}>6</button>
          <button onClick={() => handleOperator('-')} style={operatorButtonStyle}>−</button>
          
          {/* 第三行数字 */}
          <button onClick={() => inputDigit('1')} style={buttonStyle}>1</button>
          <button onClick={() => inputDigit('2')} style={buttonStyle}>2</button>
          <button onClick={() => inputDigit('3')} style={buttonStyle}>3</button>
          <button onClick={() => handleOperator('+')} style={operatorButtonStyle}>+</button>
          
          {/* 最后一行 */}
          <button onClick={() => inputDigit('0')} style={zeroButtonStyle}>0</button>
          <button onClick={inputDecimal} style={buttonStyle}>.</button>
          <button onClick={handleEquals} style={equalButtonStyle}>=</button>
        </div>
      </div>
    </div>
  );
} 