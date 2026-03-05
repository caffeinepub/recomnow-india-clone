import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Category = {
    __kind__: "jewellery";
    jewellery: JewelleryCategory;
} | {
    __kind__: "fashion";
    fashion: FashionCategory;
};
export interface Product {
    id: bigint;
    mrp: bigint;
    title: string;
    description: string;
    imageUrl: string;
    isFeatured: boolean;
    category: Category;
    affiliateLink: string;
    price: bigint;
    discountPercentage: bigint;
}
export enum FashionCategory {
    kurtaKurtis = "kurtaKurtis",
    sarees = "sarees",
    festive = "festive",
    gowns = "gowns",
    salwarSuits = "salwarSuits",
    sportsWear = "sportsWear",
    lehengaCholis = "lehengaCholis",
    westernWear = "westernWear"
}
export enum JewelleryCategory {
    necklaces = "necklaces",
    rings = "rings"
}
export interface backendInterface {
    addProduct(token: string, title: string, description: string, imageUrl: string, affiliateLink: string, price: bigint, mrp: bigint, discountPercentage: bigint, category: Category, isFeatured: boolean): Promise<Product>;
    adminLogin(username: string, password: string): Promise<string | null>;
    changeAdminCredentials(token: string, newUsername: string, newPassword: string): Promise<boolean>;
    deleteProduct(token: string, id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    updateProduct(token: string, id: bigint, title: string, description: string, imageUrl: string, affiliateLink: string, price: bigint, mrp: bigint, discountPercentage: bigint, category: Category, isFeatured: boolean): Promise<Product>;
    validateAdminToken(token: string): Promise<boolean>;
}
