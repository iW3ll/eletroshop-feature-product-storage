import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { clearLocalProducts, loadProductsLocally } from '@/services/productStorage';
import { Product } from '@/types/Product';

export default function LocalProductsScreen() {
  // Estado principal da tela: guarda a lista de produtos que foi carregada do AsyncStorage.
  const [products, setProducts] = useState<Product[]>([]);
  // Estado auxiliar para indicar se a leitura do cache ainda está em andamento.
  const [isLoading, setIsLoading] = useState(false);

  // Recupera a última lista salva no dispositivo e atualiza o estado da tela.
  const loadCachedProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const cachedProducts = await loadProductsLocally();
      setProducts(cachedProducts);
    } catch (error) {
      Alert.alert('Erro ao acessar o armazenamento local', 'Não foi possível carregar a lista salva no dispositivo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sempre que a tela voltar a receber foco, ela tenta buscar o estado mais recente do cache local.
  useFocusEffect(
    useCallback(() => {
      void loadCachedProducts();
    }, [loadCachedProducts]),
  );

  // Botão de limpeza: primeiro abre um alerta de confirmação e só depois remove os dados reais.
  const handleClearStorage = async () => {
    Alert.alert(
      'Limpar dados locais',
      'Deseja remover a lista de produtos salvos no dispositivo? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearLocalProducts();
              setProducts([]);
              Alert.alert('Sucesso', 'Os produtos locais foram removidos com segurança.');
            } catch (error) {
              Alert.alert('Erro ao limpar', 'Não foi possível excluir os dados do armazenamento local.');
            }
          },
        },
      ],
    );
  };

  // Renderiza cada produto da lista de forma organizada dentro de um card.
  const renderProduct = ({ item }: { item: Product }) => (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle" style={styles.cardTitle}>
        {item.name}
      </ThemedText>
      <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Categoria: {item.category}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Estoque: {item.stockQuantity}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Status: {item.status}
      </ThemedText>
      <ThemedText type="smallBold">Preço: R$ {item.price.toFixed(2)}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={styles.noticeBox}>
          <ThemedText type="smallBold">Dados vindos do armazenamento local</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Esta lista representa o último estado salvo no dispositivo e pode estar desatualizado
            em relação à origem remota.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.headerRow}>
          <ThemedText type="subtitle">Produtos locais</ThemedText>
          <Pressable onPress={handleClearStorage} style={styles.clearButton}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Limpar cache
            </ThemedText>
          </Pressable>
        </ThemedView>

        {isLoading ? (
          // Enquanto o cache está sendo lido, mostra um indicador de carregamento.
          <ThemedView style={styles.loadingWrapper}>
            <ActivityIndicator size="large" />
            <ThemedText type="small" themeColor="textSecondary">
              Carregando últimos produtos salvos...
            </ThemedText>
          </ThemedView>
        ) : (
          // FlatList é usado para renderizar a lista com melhor performance em telas com muitos itens.
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // Caso o cache esteja vazio, a interface mostra uma mensagem amigável para o usuário.
            ListEmptyComponent={() => (
              <ThemedView type="backgroundElement" style={styles.emptyState}>
                <ThemedText type="smallBold">Nenhum produto armazenado no dispositivo.</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Quando houver dados persistidos localmente, eles aparecerão aqui.
                </ThemedText>
              </ThemedView>
            )}
          />
        )}

        {Platform.OS === 'web' && <ThemedText type="small">Local storage cache</ThemedText>}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  noticeBox: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  clearButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#B0B4BA',
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  cardDescription: {
    marginBottom: Spacing.one,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyState: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
});
