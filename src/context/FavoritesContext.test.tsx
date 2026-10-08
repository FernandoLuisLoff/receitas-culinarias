import { describe, expect, it, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { FavoritesProvider } from './FavoritesContext';
import { useFavorites } from '../hooks/useFavorites';

function wrapper({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

describe('FavoritesContext / useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lança erro quando usado fora do FavoritesProvider', () => {
    expect(() => renderHook(() => useFavorites())).toThrow(
      'useFavorites deve ser usado dentro de um FavoritesProvider.',
    );
  });

  it('adiciona e remove um id de favoritos preservando imutabilidade', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isFavorite(1)).toBe(false);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.favoriteIds).toEqual([1]);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.favoriteIds).toEqual([]);
  });
});
