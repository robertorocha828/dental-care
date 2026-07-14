import { backendMockStatus } from '../data/mockData';
import type { BackendStatus } from '../types';

export async function obtenerEstadoBackend(): Promise<BackendStatus> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(backendMockStatus);
    }, 500);
  });
}