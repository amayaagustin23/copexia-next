import { ApiErrorResponse, isAxiosErrorType } from "@/types/api";

export function getErrorMessage(error: unknown): string {
  if (isAxiosErrorType<ApiErrorResponse>(error)) {
    const axiosError = error;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    } else if (axiosError.response) {
      return `Error del servidor: ${
        axiosError.response.statusText || "Desconocido"
      } (Estado: ${axiosError.response.status})`;
    } else if (axiosError.request) {
      return "No se pudo conectar al servidor. Verifica tu conexión a internet o la URL del backend.";
    } else {
      return "Error al configurar la petición.";
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado.";
}
