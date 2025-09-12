// Test validation cho số tiền tối đa 1 tỷ trong AddWallet

const testValidation = () => {
  console.log('=== TEST VALIDATION CHO SỐ TIỀN ===')
  
  // Test cases
  const testCases = [
    { input: '999999999', expected: 'valid', description: '999,999,999 - Hợp lệ' },
    { input: '1000000000', expected: 'valid', description: '1,000,000,000 - Hợp lệ (đúng giới hạn)' },
    { input: '1000000001', expected: 'invalid', description: '1,000,000,001 - Không hợp lệ (vượt quá 1 tỷ)' },
    { input: '5000000000', expected: 'invalid', description: '5,000,000,000 - Không hợp lệ (vượt quá 1 tỷ)' },
    { input: '0', expected: 'valid', description: '0 - Hợp lệ' },
    { input: '', expected: 'valid', description: 'Trống - Hợp lệ (không bắt buộc)' },
    { input: '-1000', expected: 'invalid', description: '-1,000 - Không hợp lệ (số âm)' }
  ]
  
  testCases.forEach(testCase => {
    const amount = parseFloat(String(testCase.input).replace(/\D/g, ''))
    let isValid = true
    let errorMsg = ''
    
    if (testCase.input && testCase.input !== '') {
      if (isNaN(amount)) {
        isValid = false
        errorMsg = 'Số tiền phải là một số hợp lệ'
      } else if (amount < 0) {
        isValid = false
        errorMsg = 'Số tiền không được âm'
      } else if (amount > 1000000000) {
        isValid = false
        errorMsg = 'Số tiền không được vượt quá 1 tỷ'
      }
    }
    
    const result = isValid ? 'valid' : 'invalid'
    const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL'
    
    console.log(`${status} ${testCase.description}`)
    console.log(`  Input: ${testCase.input}`)
    console.log(`  Parsed: ${amount}`)
    console.log(`  Expected: ${testCase.expected}, Got: ${result}`)
    if (!isValid) console.log(`  Error: ${errorMsg}`)
    console.log('---')
  })
  
  console.log('=== KIỂM TRA GIỚI HẠN KÝ TỰ ===')
  const maxDigits = 10
  const testInputs = ['12345', '1234567890', '12345678901', '123456789012345']
  
  testInputs.forEach(input => {
    let value = input.replace(/\D/g, '')
    if (value.length > maxDigits) {
      value = value.slice(0, maxDigits)
    }
    console.log(`Input: ${input} -> Processed: ${value} (${value.length} digits)`)
  })
}

// Uncomment để chạy test
// testValidation()

export default testValidation
