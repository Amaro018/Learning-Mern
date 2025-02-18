
export interface Material {
    name: string;
    description: string;
    size: string;
    color: string;
    quantity: number;
}

export interface Project {
    _id: string;
    title: string;
    images: File[]; // URLs of the images
    description: string;
    materials: Material[];
}