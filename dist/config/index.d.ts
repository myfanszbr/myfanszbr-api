import * as app from './app';
import * as file from './file';
import * as email from './email';
import * as image from './image';
import * as s3 from './s3';
import * as agora from './agora';
declare const _default: () => {
    app: typeof app;
    file: typeof file;
    email: typeof email;
    image: typeof image;
    s3: typeof s3;
    agora: typeof agora;
};
export default _default;
