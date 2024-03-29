import { GallerySearchRequest } from '../payloads';
import { GalleryService } from '../services/gallery.service';
export declare class UserGalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    searchGallery(query: GallerySearchRequest, user: any, req: any): Promise<any>;
    view(id: string, user: any): Promise<any>;
    download(res: any, id: string, user: any): Promise<any>;
}
