import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

export async function deleteLocalImage(path: string) {
  if (existsSync(path)) unlink(path);
}
