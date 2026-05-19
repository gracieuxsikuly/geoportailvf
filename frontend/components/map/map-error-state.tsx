import { ErrorState } from '@/components/content/error-state';

export function MapErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      message="Le catalogue des couches est momentanément indisponible. La carte reste utilisable en mode dégradé."
      onRetry={onRetry}
    />
  );
}
