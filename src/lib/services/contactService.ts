import { ContactSchema } from '@/schemas/contactSchema';
import api from '../axios';

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Envía un mensaje de contacto al backend
   */
  async sendContactMessage(data: ContactSchema): Promise<ContactResponse> {
    try {
      console.log('Enviando mensaje de contacto:', data);
      console.log('URL base:', api.defaults.baseURL);
      
      const response = await api.post<ContactResponse>(
        '/contact/send-message',
        data
      );
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error en contactService:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },
};

