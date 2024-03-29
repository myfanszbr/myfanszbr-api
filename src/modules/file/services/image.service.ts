import * as sharp from 'sharp';

export class ImageService {
  public async createThumbnail(filePath: string, options?: {
    width?: number;
    height?: number;
    toPath?: string;
  }) {
    // eslint-disable-next-line no-param-reassign
    options = options || {
      width: 200, // TODO - from config
      height: 200
    };

    if (options.toPath) {
      return sharp(filePath)
        .resize(options.width, options.height, { fit: 'inside' })
        .rotate()
        .toFile(options.toPath);
    }

    return sharp(filePath)
      .resize(options.width, options.height, { fit: 'inside' })
      .rotate()
      .toBuffer();
  }

  public async getMetaData(filePath: string) {
    return sharp(filePath).metadata();
  }

  public async replaceWithoutExif(filePath: string, mimeType: string) {
    return sharp(filePath, { animated: mimeType === 'image/gif' })
      .rotate()
      .toBuffer();
  }
}
