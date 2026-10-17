// Crea un administrador de demostración usando authService.registrarUsuario (no modifica el servicio).
// Es idempotente: si ya existe un admin o ese correo, no hace nada.
import { obtenerUsuarios, registrarUsuario } from '../services/authService';

export const ADMIN_DEMO = { correo: 'admin@duoc.cl', password: 'admin123' };

export function sembrarAdminDemo() {
  try {
    if (obtenerUsuarios().some((u) => u.rol === 'admin')) return false;
    return registrarUsuario({
      run: '11111111-1', nombre: 'Administrador', apellido: 'AromaEsencial',
      correo: ADMIN_DEMO.correo, password: ADMIN_DEMO.password,
      region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Oficina central',
      rol: 'admin', tipoUsuario: 'Administrador',
    }).exito;
  } catch (error) {
    return false;
  }
}
