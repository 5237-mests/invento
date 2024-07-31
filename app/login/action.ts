'use server';
import { login } from '@/lib/lib';

const navigate = async (formData: FormData) => {
  try {
    const logd = await login(formData);
    return logd;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export default navigate;
