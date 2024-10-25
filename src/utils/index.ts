// 递归重试网络请求
export async function retryRequest<T>(
  asyncFn: () => Promise<T>,
  retryDelay: number = 2000,
  onRetry?: () => void
): Promise<T> {
  const execute = async (): Promise<T> => {
    try {
      return await asyncFn(); // 直接执行函数
    } catch (error) {
      if (onRetry) onRetry();
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return execute(); // 无限重试
    }
  };

  return execute();
}

export function handleError(err: any) {
  let msg = "网络错误";
  if (err?.response?.data) {
    msg = err.response.data;
  } else if (err?.message) {
    msg = err.message;
  }
  ElMessage.error(msg);
}
