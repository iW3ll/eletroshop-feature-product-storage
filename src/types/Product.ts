// Define os estados possíveis de disponibilidade do produto.
export type ProductStatus = 'disponivel' | 'indisponivel';

// Estrutura principal do produto que será persistida localmente.
export interface Product
{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stockQuantity: number;
    status: ProductStatus;
}

// Assinatura da função responsável por salvar a lista de produtos localmente.
export type SaveProductsLocally = (products: Product[]) => Promise<void>;

// Assinatura da função que lê os produtos armazenados no dispositivo.
export type LoadProductsLocally = () => Promise<Product[]>;

// Assinatura da função que remove o cache local de produtos.
export type ClearLocalProducts = () => Promise<void>;

// Contrato do serviço de persistência para padronizar as operações de storage.
export interface ProductStorageService
{
    saveProductsLocally: SaveProductsLocally;
    loadProductsLocally: LoadProductsLocally;
    clearLocalProducts: ClearLocalProducts;
}
