import type { OrderStatus } from "../api";
import { orderStatusColors, orderStatusLabels } from "../utils/orderHelpers";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  CheckCheck,
  Ban,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusIcons: Record<OrderStatus, React.ElementType> = {
  PENDING: Clock,
  ACCEPTED: CheckCircle,
  REJECTED: XCircle,
  IN_PROGRESS: Loader2,
  COMPLETED: CheckCheck,
  CANCELLED: Ban,
};

export function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const Icon = statusIcons[status];
  const colorClass = orderStatusColors[status];
  const label = orderStatusLabels[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colorClass} ${className}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
