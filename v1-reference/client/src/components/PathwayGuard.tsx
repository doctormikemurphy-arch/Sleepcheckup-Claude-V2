import { PremiumGate } from "@/components/PremiumGate";

interface PathwayGuardProps {
  children: React.ReactNode;
}

export function PathwayGuard({ children }: PathwayGuardProps) {
  return (
    <PremiumGate featureLabel="pathway details and resources">
      {children}
    </PremiumGate>
  );
}
