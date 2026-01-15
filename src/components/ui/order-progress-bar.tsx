import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

type OrderState = 'pending' | 'validated' | 'delivered' | 'cancelled';

interface OrderProgressBarProps {
  currentState: OrderState;
  className?: string;
}

const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ currentState, className }) => {
  const steps: { state: OrderState; label: string; }[] = [
    { state: 'pending', label: 'En Cours' },
    { state: 'validated', label: 'Validée' },
    { state: 'delivered', label: 'Livrée' },
  ];

  const currentStepIndex = steps.findIndex(step => step.state === currentState);
  const isCancelled = currentState === 'cancelled';

  return (
    <div className={cn("flex items-center justify-between space-x-2 md:space-x-4", className)}>
      {isCancelled ? (
        <div className="flex flex-col items-center flex-1 text-center">
          <XCircle className="h-8 w-8 text-destructive mb-1" />
          <span className="text-sm font-medium text-destructive">Annulée</span>
        </div>
      ) : (
        steps.map((step, index) => (
          <React.Fragment key={step.state}>
            <div className="flex flex-col items-center flex-1 text-center">
              <div
                className={cn(
                  "relative w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                  index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs sm:text-sm font-medium transition-colors duration-200",
                  index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 transition-colors duration-200",
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default OrderProgressBar;