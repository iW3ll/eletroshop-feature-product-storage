/**
 * Serviço de armazenamento local usando AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

const PRODUCTS_CACHE_KEY = '@eletroshop_products';

// --- Tipos das funções ---
export type SaveProductsLocally = (products: Product[]) => Promise<void>;
export type LoadProductsLocally = () => Promise<Product[]>;
export type ClearLocalProducts = () => Promise<void>;

// --- Interface do serviço ---
export interface ProductStorageService {
  saveProductsLocally: SaveProductsLocally;
  loadProductsLocally: LoadProductsLocally;
  clearLocalProducts: ClearLocalProducts;
}

// --- Implementação ---
export const productStorage: ProductStorageService = {
  // Salva a lista convertendo para JSON
  saveProductsLocally: async (products: Product[]): Promise<void> => {
    try {
      const json = JSON.stringify(products);
      await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, json);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      throw error;
    }
  },

  // Carrega os dados, retorna array vazio se não houver
  loadProductsLocally: async (): Promise<Product[]> => {
    try {
      const data = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
      if (data !== null) {
        return JSON.parse(data) as Product[];
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar:', error);
      return [];
    }
  },

  // Remove a chave do cache
  clearLocalProducts: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
    } catch (error) {
      console.error('Erro ao limpar:', error);
      throw error;
    }
  }
};