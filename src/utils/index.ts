// 递归重试网络请求
export async function retryRequest<T>(
  asyncFn: () => Promise<T>,
  retryDelay: number = 2000,
  onRetry?: () => void
): Promise<T> {
  while (true) {
    try {
      return await asyncFn(); // 每次调用 asyncFn
    } catch (error) {
      // 假设网络错误是通过 err.code 或 err.message 判定的
      if (isNetworkError(error)) {
        if (onRetry) onRetry(); // 网络请求失败时提示
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        throw error; // 其他错误直接抛出，不重试
      }
    }
  }
}

// 判断是否为网络错误的函数
function isNetworkError(error: any): boolean {
  return error?.response === undefined || error.message.includes("Network Error");
}

export function handleError(err: any) {
  let msg = "网络错误";
  if (err?.response?.data.msg) {
    msg = err.response.data.msg;
  } else if (err?.message) {
    msg = err.message;
  } else msg = err;
  ElMessage.error(msg);
}
