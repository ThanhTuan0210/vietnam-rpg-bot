import { leoThapCommandClean } from './LeoThapCommand';

export async function leoThapCommand(message: any): Promise<void> {
  await leoThapCommandClean(message);
}
