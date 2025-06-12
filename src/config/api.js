// API配置文件
export const API_BASE_URL = 'http://localhost:8080'

// 用户相关API
export const USER_API = {
  LOGIN: `${API_BASE_URL}/api/student/login`,
  REGISTER: `${API_BASE_URL}/api/student/register`,
  RESET_PASSWORD: `${API_BASE_URL}/api/student/reset-password`,
  SEND_VERIFICATION_CODE: `${API_BASE_URL}/api/student/send-verification-code`,
  SEND_RESET_EMAIL: `${API_BASE_URL}/api/student/send-reset-email`
}

// 报名相关API
export const REGISTRATION_API = {
  GET_INFO: (studentId) => `${API_BASE_URL}/api/student/registration/${studentId}`,
  COMPLETE_STEP: `${API_BASE_URL}/api/student/registration/complete-step`
}

// 资格查询API
export const QUALIFICATION_API = {
  QUERY: `${API_BASE_URL}/api/student/qualification/query`
}

// 通用请求方法
export const request = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  console.log('发送API请求:', {
    url: url,
    method: finalOptions.method || 'GET',
    headers: finalOptions.headers,
    body: finalOptions.body
  })

  try {
    const response = await fetch(url, finalOptions)
    
    console.log('API响应状态:', response.status, response.statusText)
    
    // 尝试解析响应体
    let responseData
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
      console.log('API响应数据:', responseData)
    } else {
      const textData = await response.text()
      console.log('API响应文本:', textData)
      responseData = { message: textData }
    }

    if (!response.ok) {
      const errorMessage = responseData.message || `HTTP error! status: ${response.status}`
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      throw new Error(errorMessage)
    }

    return responseData
  } catch (error) {
    console.error('API请求异常:', error)
    throw error
  }
} 