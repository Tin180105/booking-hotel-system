export interface CreateHotelRequest {
    name: string;
    city: string;
    address: string;
    phone?: string;
    description?: string;
    commissionRate?: number;
    starRating?: number;
    status?: string;
}

export interface UpdateHotelRequest {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    description?: string;
    commissionRate?: number;
    starRating?: number;
    status?: string;
}

export interface Hotel {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string | null;
    description: string | null;
    commissionRate: number;
    starRating: number;
    status: string;
    createdAt: Date;
}