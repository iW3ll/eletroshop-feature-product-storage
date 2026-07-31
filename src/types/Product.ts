/**
 * Define a estrutura de um produto.
 */
export type ProductStatus = 'disponivel' | 'indisponivel';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
}