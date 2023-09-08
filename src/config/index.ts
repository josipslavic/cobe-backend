import { cloudinaryConfig } from './cloudinary';
import { mongooseConfig } from './mognoose';

export function createConfigs() {
  mongooseConfig();
  cloudinaryConfig();
}
