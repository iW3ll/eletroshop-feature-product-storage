import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

// Chave usada para identificar o cache de produtos no AsyncStorage.
const PRODUCTS_CACHE_KEY = '@eletroshop:products_cache';

// Salva a lista de produtos convertida em texto JSON no dispositivo.
export const saveProductsLocally = async (products: Product[]): Promise<void> =>
{
    try
    {
        const serialized = JSON.stringify(products);
        await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, serialized);
    }
    catch (error)
    {
        throw new Error('Falha ao gravar no cache local');
    }
};

// Recupera os produtos salvos localmente. Se não existir nenhum dado, retorna lista vazia.
export const loadProductsLocally = async (): Promise<Product[]> =>
{
    try
    {
        const serialized = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
        if (serialized === null)
        {
            return [];
        }
        return JSON.parse(serialized) as Product[];
    }
    catch (error)
    {
        throw new Error('Falha ao ler do cache local');
    }
};

// Remove a chave de cache, apagando os produtos persistidos no dispositivo.
export const clearLocalProducts = async (): Promise<void> =>
{
    try
    {
        await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
    }
    catch (error)
    {
        throw new Error('Falha ao limpar o cache local');
    }
};
